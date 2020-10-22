import extension from "extensionizer";
import CryptoJS from "crypto-js";
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import * as crypto from "crypto";
import ripemd160 from "ripemd160";
import CONST from "./const";
import BASE58 from "base-x";
import secp256k1 from "secp256k1";
import ecc from "tiny-secp256k1";
import mathjs from "./mathjs";
import aes from "aes-js";
import * as scrypt from "scrypt-js";
import sha3 from "js-sha3";
import { v4 } from "uuid";

function checkForError() {
  const { lastError } = extension.runtime;
  if (!lastError) {
    return undefined;
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError;
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message);
}

// AES加密
function aes_encrypt(str, key) {
  if (!str || !key) {
    console.error("no params str or key");
    return "";
  }
  return CryptoJS.AES.encrypt(str, key).toString();
}
// AES解密
function aes_decrypt(str, key) {
  if (!str || !key) {
    console.error("no params str or key");
    return "";
  }
  return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
}
// SHA256加密,不可逆
function sha256(str) {
  if (!str) {
    console.error("no params str");
    return "";
  }
  let hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}

/**
 * 生成keystore
 * @param {string} privateKey
 * @param {string} address
 * @param {string} password
 * @param {function} progressCallback
 * @return {promise} promise, resolve({}) or reject('xxx')
 */
function createKeystore(
  privateKey,
  address,
  password,
  progressCallback = () => {}
) {
  if (!address || !privateKey || !password) {
    console.error("Missing parameters");
    return Promise.reject("Missing parameters");
  }
  const pwd = Buffer.from(password);
  const prikey = HexString2Bytes(privateKey); // arrayify(privateKey);
  const salt = crypto.randomBytes(32); // Buffer.randomBytes(32); // randomBytes(32);
  const iv = crypto.randomBytes(16); // Buffer.randomBytes(16); // randomBytes(16);
  const N = 1024,
    r = 8,
    p = 1;
  return scrypt.scrypt(pwd, salt, N, r, p, 64, progressCallback).then((key) => {
    const derivedKey = key.slice(0, 16);
    const macPrefix = key.slice(16, 32);

    // Encrypt the private key
    const counter = new aes.Counter(iv);
    const aesCtr = new aes.ModeOfOperation.ctr(derivedKey, counter);
    const ciphertext = HexString2Bytes(
      Buffer.from(aesCtr.encrypt(prikey)).toString("hex")
    );

    // Compute the message authentication code, used to check the password
    const mac = sha3.keccak_256([...macPrefix, ...ciphertext]);
    const data = {
      address: address.toLowerCase(),
      id: v4().toUpperCase(),
      version: 3,
      Crypto: {
        cipherparams: {
          iv: Buffer.from(iv).toString("hex"), // hexlify(iv).substring(2),
        },
        ciphertext: Buffer.from(ciphertext).toString("hex"), // hexlify(ciphertext).substring(2),
        kdf: "scrypt",
        kdfparams: {
          salt: Buffer.from(salt).toString("hex"), // hexlify(salt).substring(2),
          n: N,
          dklen: 32,
          p: p,
          r: r,
        },
        mac,
        cipher: "aes-128-ctr",
      },
    };
    return data;
  });
}

/**
 * 解密keystore
 * @param {string} data
 * @param {string} password
 * @return {promise} promise, resolve({privateKey:'', publicKey:'', address: ''}) or reject('xxx')
 */
async function decryptKeyStore(data, password) {
  if (!data || !password) {
    console.error("Missing parameters");
    return Promise.reject("Missing parameters");
  }
  const json = JSON.parse(data);
  const kdfparams = json.Crypto ? json.Crypto.kdfparams : {};
  const r = parseInt(kdfparams.r),
    p = parseInt(kdfparams.p),
    n = parseInt(kdfparams.n),
    dklen = parseInt(kdfparams.dklen),
    salt = HexString2Bytes(kdfparams.salt); // Buffer.from(kdfparams.salt);
  if (!r || !p || !n || !dklen || !salt) {
    return Promise.reject("Missing kdfparams parameters");
  }
  if (dklen != 32) {
    return Promise.reject("wrong dklen");
  }
  const pwd = Buffer.from(password); // new Uint8Array(HexString2Bytes(password.normalize("NFKC")));

  const key = await scrypt.scrypt(pwd, salt, n, r, p, 64);
  const ciphertext = HexString2Bytes(json.Crypto.ciphertext);

  const computedMAC = sha3.keccak_256([...key.slice(16, 32), ...ciphertext]);

  if (computedMAC != json.Crypto.mac) {
    return Promise.reject("invalid password");
  }
  const privateKey = _decrypt(json, key.slice(0, 16), ciphertext);
  if (!privateKey) {
    return Promise.reject("unsupported cipher");
  }
  const keys = createKeyFromPrivateKey(privateKey);

  const address = createAddress(keys.publicKey);
  if (address.toLowerCase() != json.address) {
    return Promise.reject("address mismatch");
  }
  return Promise.resolve({
    ...keys,
    address,
  });
}

function _decrypt(data, key, ciphertext) {
  const cipher = data.Crypto.cipher; // searchPath(data, "crypto/cipher");
  if (cipher === "aes-128-ctr") {
    const iv = HexString2Bytes(data.Crypto.cipherparams.iv); // looseArrayify(searchPath(data, "crypto/cipherparams/iv"));
    const counter = new aes.Counter(iv);
    const aesCtr = new aes.ModeOfOperation.ctr(key, counter);
    return Buffer.from(aesCtr.decrypt(ciphertext)).toString("hex");
  }
  return null;
}

// 16进制转字节
function HexString2Bytes(str) {
  var pos = 0;
  var len = str.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  var arrBytes = [];
  for (var i = 0; i < len; i++) {
    var s = str.substr(pos, 2);
    var v = parseInt(s, 16);
    arrBytes.push(v);
    pos += 2;
  }
  return arrBytes;
}

/**
 * checksum
 * @param {string} address
 * @return {array} [address bytes]
 */
function checkSum(address) {
  let data = CONST.HBC_ADDRESS_PREFIX.concat(HexString2Bytes(address));
  let hash = crypto.createHash("sha256");
  hash.update(data);
  let res = hash.digest("hex");
  let hash2 = crypto.createHash("sha256");
  hash2.update(HexString2Bytes(res));
  res = hash2.digest("hex");
  res = HexString2Bytes(res);
  return res;
}
/**
 * 4 地址 =  base58.encode(HBC前缀 + address + checkSum的前4个byte)
 * @param {string} address
 * @return {string} address
 */
function createHBCAddress(address) {
  let checksum = checkSum(address);
  checksum = checksum.splice(0, 4);
  const addr = HexString2Bytes(address);
  let data = [...CONST.HBC_ADDRESS_PREFIX, ...addr, ...checksum];
  const res = base58(Buffer.from(data));
  return res;
}
/**
 * 3、根据公钥计算address
 * @param {string} publicKey
 * @return {string} address hex string
 */
function createAddress(publicKey) {
  const hash = crypto.createHash("sha256");
  hash.update(publicKey);
  const res = hash.digest("hex");

  let key = new ripemd160()
    .update(Buffer.from(HexString2Bytes(res)))
    .digest("hex");
  const address = createHBCAddress(key);
  return address;
}

/**
 * 2 助记词计算秘钥,公钥
 * @params {string} mnemonic 12词
 * @params {string} path
 * @return {object} { privateKey: Uint8Array(32) , publicKey: Uint8Array(33) }
 */
function createKey(mnemonic, path = "m/44'/496'/0'/0/0") {
  let seedhex = bip39.mnemonicToSeedSync(mnemonic);
  let root = bip32.fromSeed(seedhex);
  const child = root.derivePath(path);
  return {
    privateKey: child.privateKey,
    publicKey: child.publicKey,
  };
}
/**
 * 2.1 根据私钥计算公钥
 * @params {string|buffer} privateKey
 * @return {object} { privateKey: Uint8Array(32) , publicKey: Uint8Array(33) }
 */
function createKeyFromPrivateKey(privateKey) {
  if (!privateKey) {
    console.error("privateKey is require");
    return {
      privateKey: null,
      publicKey: null,
    };
  }
  const prikey =
    Object.prototype.toString.call(privateKey) == "[object String]"
      ? HexString2Bytes(privateKey)
      : privateKey;
  const pubkey = ecc.pointFromScalar(Buffer.from(prikey), true);
  return {
    privateKey: prikey,
    publicKey: pubkey,
  };
}

/**
 * 1、随机12助记词
 */
function createMnemonic() {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
}

/**
 * base58生成HBC地址
 * @param {buffer} str
 */
function base58(str) {
  if (!str) {
    return "";
  }
  const str_b58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const fn_base58 = BASE58(str_b58);
  const data = fn_base58.encode(str);
  return data;
}

/**
 * sign
 * @param {object} 要加密的内容
 * @param {string} privateKey 私钥
 * @return {string} sign
 */
function sign(obj, privateKey) {
  if (!obj || !privateKey) {
    console.error("no params obj or privateKey");
    return "";
  }

  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(obj));
  const msg = new Uint8Array(HexString2Bytes(hash.digest("hex")));

  const sign = secp256k1.ecdsaSign(
    msg,
    new Uint8Array(HexString2Bytes(privateKey))
  );
  const signature = Buffer.from(sign.signature).toString("base64");

  return signature;
}

function hex_to_rgba(hex, a) {
  if (!hex || hex.indexOf("#") == -1) {
    return "rgba(0,0,0,0)";
  }
  if (hex.length != 7 && hex.length != 4) {
    console.error(`${hex} is not hex color`);
    return "rgba(0,0,0,0)";
  }
  let s = hex.replace("#", "").match(/^(..?)(..?)(..?)/);
  return `rgba(${parseInt(
    "0x" + s[1] + (s[1].length == 1 ? s[1] : "")
  )},${parseInt("0x" + s[2] + (s[2].length == 1 ? s[2] : ""))},${parseInt(
    "0x" + s[3] + (s[3].length == 1 ? s[3] : "")
  )},${Number(a) || 1})`;
}

/**
 * json sort
 * @param {object} json or array
 * @return {object} json
 */
function jsonSort(obj) {
  if (!obj) {
    return obj;
  }
  const types = Object.prototype.toString.call(obj);
  if (types == "[object Array]") {
    let d = [];
    obj.map((item) => {
      d.push(jsonSort(item));
    });
    return d;
  }
  if (types == "[object Object]") {
    let d = [];
    for (let k in obj) {
      d.push([k, jsonSort(obj[k])]);
    }
    d.sort((a, b) => (a[0].toUpperCase() >= b[0].toUpperCase() ? 1 : -1));
    let data = {};
    d.map((item) => {
      data[item[0]] = item[1];
    });
    return data;
  }
  return obj;
}
function rates(v, t, unit, rates = {}) {
  let fix = "";
  if (unit === "usd") {
    fix = "$";
  }
  if (unit === "cny") {
    fix = "￥";
  }
  if (v === "" || v === undefined || Number.isNaN(Number(v)) || !t) {
    return ["--", "", ""];
  }
  // 无汇率，返回0
  if (!rates[t]) {
    return ["--", "", ""];
  }
  let u = unit;
  if (!rates[t][u]) {
    u = "usd";
  }

  const d = mathjs
    .chain(mathjs.bignumber(v))
    .multiply(rates[t][u])
    .format({ notation: "fixed", precision: 2 })
    .done();

  if (fix) {
    return [d, "", fix];
  }
  return [d, u.toUpperCase(), fix];
}

export default {
  checkForError,
  aes_decrypt,
  aes_encrypt,
  sha256,
  createKeystore,
  decryptKeyStore,
  createKeyFromPrivateKey,
  // 随机词
  createMnemonic,
  // 创建公钥私钥
  createKey,
  // 根据公钥创建地址
  createAddress,
  hex_to_rgba,
  jsonSort,
  sign,
  HexString2Bytes,
  rates,
};
