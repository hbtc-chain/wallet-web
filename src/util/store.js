// 与background进行数据交换
import extension from "extensionizer";
import log from "loglevel";
import helper from "./helper";

const env = window.location.hostname == "localhost" ? "local" : "production";

/**
 * A wrapper around the extension's storage local API
 */
class ExtensionStore {
  /**
   * @constructor
   */
  constructor() {
    this.isSupported = env == "local" ? true : Boolean(extension.storage.local);
    if (!this.isSupported) {
      log.error("Storage local API not available.");
    }
    this.bg = env == "local" ? null : extension.extension.getBackgroundPage();
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
    if (!result || isEmpty(result)) {
      return undefined;
    }
    return result;
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
    if (env === "local") {
      let res = {};
      return new Promise((resolve, reject) => {
        try {
          res = window.sessionStorage.local
            ? JSON.parse(window.sessionStorage.local)
            : {};
        } catch (e) {
          log.error(e.message);
          //reject(e.message);
        }
        resolve(res);
      });
    }

    return this.bg.store.get();
  }

  /**
   * Sets the key in local state
   * @param {Object} obj - The key to set
   * @returns {Promise<void>}
   * @private
   */
  _set(obj) {
    if (env === "local") {
      let res = this.get();
      return new Promise((resolve, reject) => {
        try {
          res = Object.assign(res, obj);
          window.sessionStorage.setItem("local", JSON.stringify(res));
        } catch (e) {
          log.error(e.message);
          //reject(e.message);
        }
        resolve();
      });
    }
    return this.bg.store.set(obj);
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

const store = new ExtensionStore();

export default store;
