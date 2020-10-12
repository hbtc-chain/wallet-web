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
import { v4 } from "uuid";

const env = window.location.hostname == "localhost" ? "local" : "server";

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

class MessageManager {
  constructor(dispatch, history, routerRedux) {
    this.dispatch = dispatch;
    this.history = history;
    this.routerRedux = routerRedux;
    if (env != "local") {
      this.port = extension.runtime.connect({ name: "popup" });
      this.port.onMessage.addListener((msg) => {
        let obj = {};
        try {
          obj = JSON.parse(msg);
        } catch (e) {}
        if (Object.keys(obj).length == 0) {
          return;
        }
        console.warn("popup get msg:");
        console.warn(obj);
        this.handleMsg(obj);
      });
    }
  }
  currentTab() {
    return new Promise((resolve, reject) => {
      extension.tabs.getCurrent((tab) => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve(tab);
        }
      });
    });
  }

  switchToTab(tabId) {
    return new Promise((resolve, reject) => {
      extension.tabs.update(tabId, { highlighted: true }, (tab) => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve(tab);
        }
      });
    });
  }
  async handleMsg(obj) {
    const data = await Store.get();
    // login
    if (obj.type == CONST.METHOD_LOGIN && obj.to == CONST.MESSAGE_FROM_POPUP) {
      if (obj.data && obj.data.code == 200) {
        this.dispatch({
          type: "layout/save",
          payload: {
            logged: true,
          },
        });
      }
    }
    // logged status query
    if (
      obj.type == CONST.METHOD_LOGGED_STATUS_QUERY &&
      obj.to == CONST.MESSAGE_FROM_POPUP
    ) {
      this.dispatch({
        type: "layout/save",
        payload: {
          logged: obj.data ? obj.data.logged : false,
        },
      });
    }
    // sign
    // 签名消息正确性在background中已验证，无须再次验证
    if (obj.type == CONST.METHOD_SIGN && obj.to == CONST.MESSAGE_FROM_POPUP) {
      this.dispatch(
        this.routerRedux.push({
          pathname: route_map.sign,
          search: "?id=" + obj.id + "&tabId=" + obj.tabId,
        })
      );
      const tabid = await this.currentTab();
      console.log(tabid);
    }
    // connect
    if (
      obj.type == CONST.MEHTOD_CONNECT &&
      obj.to == CONST.MESSAGE_FROM_POPUP
    ) {
      this.dispatch(
        this.routerRedux.push({
          pathname: route_map.connect,
          state: obj,
        })
      );
    }
    // get_balance
    if (
      obj.type == CONST.METHOD_GET_BALANCE &&
      obj.to == CONST.MESSAGE_FROM_POPUP
    ) {
      if (obj.data && obj.data.address) {
        this.dispatch({
          type: "layout/get_balance",
          payload: {
            [obj.data.address]: obj.data,
          },
        });
      }
    }
  }
  /**
   * 发送消息到background
   * @param {*} obj
   */
  sendMessage({ id, type, data }) {
    let obj = util.packmsg({
      from: CONST.MESSAGE_FROM_POPUP,
      to: CONST.MESSAGE_FROM_BACKGROUND,
      id: id || v4(),
      type,
      data,
    });
    console.warn("send msg to bg:");
    console.warn(obj);
    if (window.location.hostname !== "localhost") {
      this.port.postMessage(JSON.stringify(obj));
    }
  }
}

export default MessageManager;
