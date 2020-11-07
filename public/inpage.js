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
    window.HBTC_wallet_isready = true;
    window.onmessage = (e) => {
      const data = e.data;
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
      //console.warn(e.message);
    }
    if (Object.keys(obj).length == 0) {
      return;
    }
    if (obj.to == CONST.MESSAGE_FROM_PAGE) {
      // console.log("page get msg:");
      // console.log(obj);
      let id = obj.id;
      let d = this.msgs.get(id);
      if (d) {
        // 发送过的消息回调
        d.cb && d.cb(obj.data);
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
  callHandler(name, _data, _cb) {
    if (!name || Object.prototype.toString.call(name) != "[object String]") {
      return;
    }
    let id = "";
    const data = !_cb && typeof _data == "function" ? {} : _data;
    const cb = !_cb && typeof _data == "function" ? _data : _cb;
    try {
      if (this[name]) {
        id = this[name](data, cb);
      }
    } catch (e) {
      cb && cb({ code: 400, msg: `no ${name} method` });
    }
    return id;
  }
  /**
   * 签名请求
   * @param {object} data 待签名的json data
   * @param {function} cb 回调
   * @return {string} msg.id
   */
  sign(data, cb = () => {}) {
    let msg = util.packmsg({
      from: CONST.MESSAGE_FROM_PAGE,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      type: CONST.METHOD_SIGN,
      data,
    });
    this.msgs.set(msg.id, { ...msg, cb });
    this.postMessage(msg);
    return msg.id;
  }
  /**
   * 链接钱包
   * @param {function} success 成功回调
   * @param {function} error 失败回调
   * @return {string} msg.id
   */
  connect(data, cb = () => {}) {
    let msg = util.packmsg({
      from: CONST.MESSAGE_FROM_PAGE,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      type: CONST.MEHTOD_CONNECT,
      data: {
        orign: window.location.hostname,
      },
    });
    this.msgs.set(msg.id, { ...msg, cb });
    this.postMessage(msg);
    return msg.id;
  }
  /**
   * 获取账户
   * @param {function} success
   * @param {function} error
   * @return {string} msg.id
   */
  get_account(data, cb = () => {}) {
    let msg = util.packmsg({
      from: CONST.MESSAGE_FROM_PAGE,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      type: CONST.METHOD_GET_ACCOUNT,
    });
    this.msgs.set(msg.id, { ...msg, cb });
    this.postMessage(msg);
    return msg.id;
  }
  /**
   * 资产查询
   * @param {*} id
   */
  get_balance(data, cb = () => {}) {
    let msg = util.packmsg({
      from: CONST.MESSAGE_FROM_PAGE,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      type: CONST.METHOD_GET_BALANCE,
    });
    this.msgs.set(msg.id, { ...msg, cb });
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
window.HBTC_wallet = new MessageManager();
