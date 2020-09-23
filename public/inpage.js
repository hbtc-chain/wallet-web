import util from "../src/util/util";
import CONST from "../src/util/const";

/**
 * 提供方法到web页面
 * 1、链接插件
 * 2、读取账户
 * 3、sign签名请求
 *
 */
class MessageManager {
  constructor() {
    // 保存已发送的消息
    this.msgs = new Map();
    window.HBC_wallet_isready = true;
    window.onmessage = (e) => {
      const data = e.data;
      console.log("page get msg:");
      console.log(data);
      this.messagehandle(data);
    };
  }
  /**
   * 处理收到的消息
   * @param {any} data 接收到的消息
   */
  messagehandle(data) {
    if (!data) {
      return;
    }
    let obj = {};
    try {
      obj = JSON.parse(data);
    } catch (e) {
      console.warn(e.message);
    }
    if (Object.keys(obj).length == 0) {
      return;
    }
    console.log(data, this.msgs);
    if (obj.to == CONST.MESSAGE_FROM_PAGE) {
      let id = obj.id;
      let d = this.msgs.get(id);
      if (d) {
        // 发送过的消息回调
        if (obj.data.code == 200) {
          d.success && d.success(obj.data);
        } else {
          d.error && d.error(obj.data);
        }
        this.msgs.delete(id);
      }
    }
  }
  /**
   * obj
   * @param {string} obj.name 方法名
   * @param {object} obj.data 参数
   * @param {function} obj.success 成功回调
   * @param {function} obj.error 失败回调
   */
  callHandler(obj) {
    const name = obj.name;
    const data = obj.data || {};
    if (!name) {
      return;
    }
    let id = "";
    try {
      if (this[name]) {
        id = this[name](data, obj.success, obj.error);
      }
    } catch (e) {
      obj.error && obj.error({ code: 400, msg: `no ${name} method` });
    }
    return id;
  }
  /**
   * 签名请求
   * @param {object} data 待签名的json data
   * @param {function} success 成功回调
   * @param {function} error 失败回调
   * @return {string} msg.id
   */
  sign(data, success = () => {}, error = () => {}) {
    let msg = util.packmsg({
      from: CONST.MESSAGE_FROM_PAGE,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      type: CONST.METHOD_SIGN,
      data,
    });
    this.msgs.set(msg.id, { ...msg, success, error });
    this.postMessage(msg);
    return msg.id;
  }
  /**
   * 链接钱包
   * @param {function} success 成功回调
   * @param {function} error 失败回调
   * @return {string} msg.id
   */
  connect(data, success = () => {}, error = () => {}) {
    let msg = util.packmsg({
      from: CONST.MESSAGE_FROM_PAGE,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      type: CONST.MEHTOD_CONNECT,
      data: {
        orign: window.location.hostname,
      },
    });
    console.log(success, error);
    this.msgs.set(msg.id, { ...msg, success, error });
    this.postMessage(msg);
    return msg.id;
  }
  /**
   * 获取账户
   * @param {function} success
   * @param {function} error
   * @return {string} msg.id
   */
  get_account(data, success = () => {}, error = () => {}) {
    let msg = util.packmsg({
      from: CONST.MESSAGE_FROM_PAGE,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      type: CONST.METHOD_GET_ACCOUNT,
    });
    this.msgs.set(msg.id, { ...msg, success, error });
    this.postMessage(msg);
    return msg.id;
  }
  // 取消已发送的事件，如签名，获取账户等
  cancel(id) {
    id && this.msgs.clear(id);
  }
  postMessage(msg) {
    let d =
      Object.prototype.toString.call(msg) == "[object String]"
        ? msg
        : JSON.stringify(msg);
    window.postMessage(d);
  }
}
window.HBC_wallet = new MessageManager();
