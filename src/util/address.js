// node = v.14.2  npm = 6.14.4
import * as bip39 from "bip39"; // "^3.0.2"
import * as bip32 from "bip32"; // "2.0.5"
import * as crypto from "crypto"; // "^4.0.0"
import ripemd160 from "ripemd160"; //  "2.0.2",
import BASE58 from "base-x"; //  "3.0.8",
import ecc from "tiny-secp256k1"; // "1.1.5",
import aes from "aes-js"; // "3.1.2",
import * as scrypt from "scrypt-js"; // "3.0.1",
import sha3 from "js-sha3"; // "0.8.0",
import { v4 } from "uuid";

const CONST = {
  HBC_ADDRESS_PREFIX: [2, 16, 66],
  HBC_PATH: "m/44'/496'/0'/0/0",
};
/**
 * 1、随机12助记词
 */
function createMnemonic() {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
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
 * base58.encode(HBC前缀 + address + checkSum的前4个byte)
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

export default {
  createKeystore,
  decryptKeyStore,
  createKeyFromPrivateKey,
  // 随机词
  createMnemonic,
  // 创建公钥私钥
  createKey,
  // 根据公钥创建地址
  createAddress,

  HexString2Bytes,
};
