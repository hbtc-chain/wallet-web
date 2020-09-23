/**
 * popup to background message
 * message:{
 *   from:'popup',
 *   to:'background',
 *   tabid:'当前tabid，如果有的话',
 *   time:'时间戳',
 *   data:{}
 * }
 */
import extension from "extensionizer";
import CONST from "./const";
import Store from "./store";
import route_map from "../config/route_map";
import util from "./util";

const env = window.location.hostname == "localhost" ? "local" : "server";

class MessageManager {
  constructor(dispatch, history, routerRedux) {
    this.dispatch = dispatch;
    this.history = history;
    this.routerRedux = routerRedux;
    if (env != "local") {
      this.port = extension.runtime.connect({ name: "popup" });
      this.port.onMessage.addListener((msg) => {
        console.log("popup get msg:" + msg);
        let obj = {};
        try {
          obj = JSON.parse(msg);
        } catch (e) {}
        if (Object.keys(obj).length == 0) {
          return;
        }
        this.handleMsg(obj);
      });
    }
  }
  async handleMsg(obj) {
    const data = await Store.get();
    // sign
    // 签名消息正确性在background中已验证，无须再次验证
    if (obj.type == CONST.METHOD_SIGN) {
      this.dispatch(
        this.routerRedux.push({
          pathname: route_map.sign,
          search: "?id=" + obj.id + "&tabId=" + obj.tabId,
        })
      );
    }
    // connect
    if (obj.type == CONST.MEHTOD_CONNECT) {
      this.dispatch(
        this.routerRedux.push({
          pathname: route_map.connect,
          state: obj,
        })
      );
    }
  }
  /**
   * 发送消息到background
   * @param {*} obj
   */
  sendMessage({ id, type, tabId, data }) {
    let obj = util.packmsg({
      from: CONST.MESSAGE_FROM_POPUP,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      id,
      type,
      tabId,
      data,
    });
    this.port.postMessage(JSON.stringify(obj));
  }
}

export default MessageManager;
