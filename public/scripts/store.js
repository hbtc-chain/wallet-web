// 数据管理
// 与background进行数据交换
import extension from "extensionizer";
import log from "loglevel";

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

/**
 * A wrapper around the extension's storage local API
 */
class ExtensionStore {
  /**
   * @constructor
   */
  constructor() {
    this.isSupported = Boolean(extension.storage.local);
    if (!this.isSupported) {
      log.error("Storage local API not available.");
    }
    this.broadcast = null;
  }
  /**
   * Returns all of the keys currently saved
   * @returns {Promise<*>}
   */
  async get() {
    if (!this.isSupported) {
      return undefined;
    }
    const result = await this._get();
    // extension.storage.local always returns an obj
    // if the object is empty, treat it as undefined
    if (isEmpty(result)) {
      return undefined;
    }
    return { ...result };
  }

  /**
   * Sets the key in local state
   * @param {Object} state - The state to set
   * @returns {Promise<void>}
   */
  async set(state) {
    return this._set(state);
  }

  /**
   * Returns all of the keys currently saved
   * @private
   * @returns {Object} - the key-value map from local storage
   */
  _get() {
    const { local } = extension.storage;
    return new Promise((resolve, reject) => {
      local.get(null, (/** @type {any} */ result) => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve({ ...result });
        }
      });
    });
  }

  /**
   * Sets the key in local state
   * @param {Object} obj - The key to set
   * @returns {Promise<void>}
   * @private
   */
  async _set(obj = {}) {
    const { local } = extension.storage;
    const all = await this.get();
    return new Promise((resolve, reject) => {
      let data = { ...all, ...obj };
      local.set(data, () => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          this.broadcast && this.broadcast({ store: data });
          resolve();
        }
      });
    });
  }
  set_broadcast(cb) {
    this.broadcast = cb;
  }
}

/**
 * Returns whether or not the given object contains no keys
 * @param {Object} obj - The object to check
 * @returns {boolean}
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function browserLang() {
  var ls = navigator.languages ? navigator.languages.length : 0;
  var res = (ls
    ? navigator.languages[0]
    : navigator.language || navigator.userLanguage
  ).toLowerCase();
  if (res != "zh-cn") {
    res = "en-us";
  }
  return res;
}

const store = new ExtensionStore();
const init_data = {
  accounts: [],
  account_index: -1,
  sites: [],
  unit: "usd",
  lang: browserLang(),
  chain: [
    {
      name: "main net",
      url: "https://explorer.hbtcchain.io",
      chain_id: "hbtc-testnet",
      exc: "https://juswap.io",
      explorer: "https://explorer.hbtcchain.io",
    },
    {
      name: "Test net",
      url: "https://explorer.hbtcchain.io", // api接口地址
      chain_id: "hbtc-testnet",
      exc: "https://dex.hbtcchain.io", // 跳往web交易
      explorer: "https://explorer.hbtcchain.io", // 浏览器地址
    },
  ],
  chain_index: 1, // 0 = main chain , 1 = test chain
  pwd_rule: 0, // 0 = 每次都输入密码， 1 = 30分内输入一次
};
// 数据初始化
const data_init = async () => {
  let data = await store.get();
  if (data) {
    data = Object.assign(init_data, data);
  } else {
    data = init_data;
  }
  await store.set(init_data);
};
data_init();

export default store;
