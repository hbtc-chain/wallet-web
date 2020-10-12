import extension from "extensionizer";
import CryptoJS from "crypto-js";
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import * as crypto from "crypto";
import ripemd160 from "ripemd160";
import CONST from "./const";
import BASE58 from "base-x";
import secp256k1 from "secp256k1";
import mathjs from "./mathjs";

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

// /**
//  * 生成keystore
//  * @param {str} privateKey
//  * @param {str} password
//  * @return {promise} promise, resolve({}) or reject('xxx')
//  */
// function createKeystore(privateKey, password) {
//   return new Promise((resolve, reject) => {
//     if (!privateKey || !password) {
//       reject("no params privateKey or password");
//       return;
//     }
//     const wallet = new ethers.Wallet(privateKey);
//     wallet
//       .encrypt(password)
//       .then((json) => {
//         resolve(json);
//       })
//       .catch((e) => reject(e));
//   });
// }

// /**
//  * 解密keystore
//  * @param {object} json
//  * @param {str} password
//  * @return {promise} promise, resolve({}) or reject('xxx')
//  */
// function decryptKeyStore(json, password) {
//   return new Promise((resolve, reject) => {
//     if (!json || !password) {
//       reject("no params json or password");
//       return;
//     }
//     ethers.Wallet.fromEncryptedJson(json, password)
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((e) => reject(e));
//   });
// }

// 16进制转字节
function HexString2Bytes(str) {
  var pos = 0;
  var len = str.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  var arrBytes = new Array();
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
 * 8 地址 =  base58.encode(HBC前缀 + address + checkSum的前4个byte)
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
 * 7、根据公钥计算address
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
 * 6 助记词计算秘钥,公钥
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
 * 随机12助记词
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
  if (
    v === "" ||
    v === undefined ||
    Number.isNaN(Number(v)) ||
    !t ||
    !rates[t]
  ) {
    return ["--", (unit || "").toUpperCase()];
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
  return [d, u.toUpperCase()];
}

export default {
  checkForError,
  aes_decrypt,
  aes_encrypt,
  sha256,
  // createKeystore,
  // decryptKeyStore,
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
