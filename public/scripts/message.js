import extension from "extensionizer";
import store from "./store";
import CONST from "../../src/util/const";
import util from "../../src/util/util";
import querystring from "query-string";
import request from "./request";
import API from "../../src/util/api";
import Sign from "../../src/util/sign";

export default class MessageManager {
  constructor(opts) {
    // 存储sign请求，直到用户通过或拒绝
    this.signmsgs = {};
    // 存储balance
    this.balance = new Map();
    this.openPopup = opts.openPopup;
    this.popupIsOpen = opts.popupIsOpen;
    this.setpopupIsOpen = opts.setpopupIsOpen;
    this.platform = opts.platform;
    this.notificationManager = opts.notificationManager;

    // 登录状态
    this.logged = false;
    // password, 30分钟免密
    this.password = "";
    this.no_pwd = false;
    this.clear_pwd_timer = null;

    // 启动资产查询loop
    this.get_balance_loop();

    // sign消息数量监听
    this.updateBadge();

    this.port = new Map();
    extension.runtime.onConnect.addListener((port) => {
      if (port.name == "popup") {
        this.popupIsOpen = true;
        this.setpopupIsOpen(this.popupIsOpen);
      }
      this.port.set(
        port.sender.tab ? port.sender.tab.id : port.sender.id,
        port
      );
      port.onMessage.addListener(this.msglistener(port));
      port.onDisconnect.addListener((res) => {
        this.port.delete(res.sender.tab ? res.sender.tab.id : res.sender.id);
        let haspopup = false;
        this.port.forEach((item) => {
          if (item.name == "popup") {
            haspopup = true;
          }
        });
        this.popupIsOpen = haspopup;
        this.setpopupIsOpen(this.popupIsOpen);
      });
    });
  }
  msglistener(port) {
    return (msg) => {
      return this.handleMsg(msg, port);
    };
  }
  /**
   * @param {object} msg
   * @param {string} msg.id
   * @param {string} msg.from [popup, background, page]
   * @param {string} msg.to  [popup, background, page]
   * @param {string} msg.to [popup, background, page]
   * @param {string} msg.tabId 浏览器tab id，如果是发送到page的消息，则发送到=tabid的这个tab，如果没有，读取当前激活的窗口tabid
   * @param {number} msg.time 时间戳
   * @param {string} msg.typs 事件类型：sign签名，connect链接插件，get_account获取账户信息，其他业务以后在增加, set_store, get_store
   * @param {object} data 具体的消息内容
   *
   */
  async handleMsg(msg, port) {
    if (!msg) {
      return;
    }
    if (!this.port.has(port.sender.tab ? port.sender.tab.id : port.sender.id)) {
      return;
    }
    let obj = {};
    try {
      obj = JSON.parse(msg);
    } catch (e) {}
    if (Object.keys(obj).length == 0) {
      return;
    }
    // console.warn("background 接收到消息：" + msg);
    // 发送到background
    if (obj.to == CONST.MESSAGE_FROM_BACKGROUND) {
      if (obj.type == CONST.METHOD_LOGGED_STATUS_QUERY) {
        if (obj.from == CONST.MESSAGE_FROM_POPUP) {
          this.sendMsgToPopup({ ...obj, data: { logged: this.logged } }, port);
        } else {
          this.sendMsgToPage({ ...obj, data: { logged: this.logged } }, port);
        }
      }
      if (
        obj.type == CONST.METHOD_LOGIN &&
        obj.from == CONST.MESSAGE_FROM_POPUP
      ) {
        this.login(obj, port);
        return;
      }
      if (
        obj.type == CONST.METHOD_LOGOUT &&
        obj.from == CONST.MESSAGE_FROM_POPUP
      ) {
        this.logout(obj, port);
        return;
      }
      // 保存数据
      if (
        obj.type == CONST.METHOD_SET_STORE &&
        obj.from == CONST.MESSAGE_FROM_POPUP
      ) {
        store.set(obj.data);
      }
      // 读取数据
      if (
        obj.type == CONST.METHOD_GET_STORE &&
        obj.from == CONST.MESSAGE_FROM_POPU
      ) {
        const data = await store.get();
        this.sendMsgToPopup({ ...obj, data: data }, port);
      }
      // get_account
      if (
        obj.type == CONST.METHOD_GET_ACCOUNT &&
        obj.from == CONST.MESSAGE_FROM_PAGE
      ) {
        this.get_account(obj, port);
      }
      // 页面发送sign请求
      if (
        obj.type == CONST.METHOD_SIGN &&
        obj.from == CONST.MESSAGE_FROM_PAGE
      ) {
        this.sign(obj, port);
      }
      // popup回复sign请求
      if (
        obj.type == CONST.METHOD_SIGN &&
        obj.from == CONST.MESSAGE_FROM_POPUP
      ) {
        this.sign_result(obj, port);
      }
      // 页面发送 connect请求
      if (
        obj.type == CONST.MEHTOD_CONNECT &&
        obj.from == CONST.MESSAGE_FROM_PAGE
      ) {
        this.connect(obj, port);
      }
      // popup回复 connect请求
      if (
        obj.type == CONST.MEHTOD_CONNECT &&
        obj.from == CONST.MESSAGE_FROM_POPUP
      ) {
        this.sendMsgToPage(obj, port);
      }

      // request get_balance
      if (obj.type == CONST.METHOD_GET_BALANCE) {
        this.get_balance(obj, port);
      }

      // 保存免密配置
      if (obj.type == CONST.METHOD_SAVE_PASSWORD) {
        this.save_password(obj, port);
      }
      // 查询免密配置
      if (obj.type == CONST.METHOD_QUERY_PASSWORD) {
        this.query_password();
      }
    }
  }
  /**
   * 查找已经打开的popup
   * @return {string} popup window id
   */
  async findePopup() {
    let win_id = "";
    this.port.forEach((item) => {
      if (item.name == "popup" && item.sender.tab) {
        win_id = item.sender.tab.id;
      }
    });
    return win_id;
  }
  /**
   * sign,get_account等操作的前置判断
   * @param {object} obj
   * @param {string} type
   * @param {object} port
   * @return {boolean} boolean
   */
  async account_logined(obj, type, port) {
    const datas = await store.get();
    // todo 无账户
    if (!datas.accounts || datas.accounts.length == 0) {
      this.sendMsgToPage(
        {
          id: obj.id,
          type,
          data: {
            msg: "No account in wallet",
            code: 400,
          },
        },
        port
      );
      return false;
    }
    const orign = port.sender.url || "";
    const sites = datas.sites || [];
    const index = sites.findIndex((item) => orign.indexOf(item) > -1);
    // todo 未链接钱包
    if (index == -1 && obj.from == CONST.MESSAGE_FROM_PAGE) {
      this.sendMsgToPage(
        {
          id: obj.id,
          type,
          data: {
            msg: "HBC_wallet not connected",
            code: 400,
          },
        },
        port
      );
      return false;
    }

    // todo 未登录
    if (!this.logged && type != CONST.METHOD_LOGIN) {
      this.sendMsgToPage(
        {
          id: obj.id,
          type,
          data: {
            msg: "Not logged in",
            code: 400,
          },
        },
        port
      );
      return false;
    }

    return true;
  }
  /**
   * connect 授权
   * @param {*} obj
   */
  async connect(obj, port) {
    const datas = await store.get();
    const accounts = datas.accounts;
    // 未创建账户
    if (!accounts || accounts.length == 0) {
      //this.platform.openExtensionInBrowser("/welcome");
      this.sendMsgToPage(
        {
          id: obj.id,
          type: obj.type,
          data: {
            msg: "No account in wallet",
            code: 400,
          },
        },
        port
      );
      return;
    }
    const origin = querystring.parseUrl(port.sender.origin || "").url;
    const sites = datas.sites || [];
    const index = sites.findIndex((item) => origin.indexOf(item) > -1);
    // 已授权过，已登录
    if (index > -1 && this.logged) {
      this.sendMsgToPage(
        {
          id: obj.id,
          type: obj.type,
          data: {
            code: 200,
            msg: "OK",
          },
        },
        port
      );
    } else {
      this.sendMsgToPopup(
        {
          id: obj.id,
          type: obj.type,
          data: { ...obj.data, tab: port.sender.tab, origin },
        },
        port
      );
    }
  }
  /**
   * get_account 获取账户信息
   * @param {object} obj
   * @param {object} port
   */
  async get_account(obj, port) {
    const res = await this.account_logined(obj, CONST.METHOD_GET_ACCOUNT, port);
    // 返回当前账户地址
    if (res) {
      const datas = await store.get();
      const account =
        datas.account_index > -1 && datas.accounts
          ? datas.accounts[datas.account_index]
          : { address: "" };
      this.sendMsgToPage(
        {
          id: obj.id,
          type: CONST.METHOD_GET_ACCOUNT,
          data: {
            code: 200,
            msg: "OK",
            data: {
              address: account.address,
            },
          },
        },
        port
      );
    }
  }
  /**
   * get_balance
   * @param {object} obj
   * @param {object} port
   */
  async get_balance(obj, port) {
    const res = await this.account_logined(obj, CONST.METHOD_GET_BALANCE, port);
    if (res) {
      const datas = await store.get();
      const account = datas.accounts[datas.account_index];
      const address = account.address;
      const data = this.balance.get(address) || {};
      // popup and popup is open
      if (port.name == "popup") {
        if (this.popupIsOpen) {
          this.sendMsgToPopup({ ...obj, data }, port);
        }
      } else {
        this.sendMsgToPage({ ...obj, data }, port);
      }
    }
  }
  /**
   * get_balance_loop 后台轮询获取资产
   */
  async get_balance_loop() {
    const datas = await store.get();
    if (
      datas &&
      datas.accounts &&
      datas.accounts.length &&
      datas.account_index > -1 &&
      this.logged
    ) {
      const account = datas.accounts[datas.account_index];
      const address = account.address;
      try {
        const result = await request(API.cus + "/" + address);
        if (result.code == 200) {
          this.balance.set(address, result.data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    await util.delay(2000);
    this.get_balance_loop();
  }
  /**
   * sign to popup 消息发送popup，等待签名
   * @param {*} obj
   */
  async sign(obj, port) {
    const res = await this.account_logined(obj, CONST.METHOD_SIGN, port);
    // 发送消息到popup
    if (res) {
      // 验证数据正确性
      let d = { ...obj.data };
      if (!d || !d.value) {
        this.sendMsgToPage(
          { ...obj, data: { code: 400, msg: "Missing parameters" } },
          port
        );
        return;
      }
      let sign_obj = {
        ...obj,
        data: {
          msgs: [d],
        },
      };
      // 获取sequence
      try {
        let data = Sign.get_info_from_msgs(sign_obj.data.msgs[0]);
        const result = await request(API.cus + "/" + data.address);
        if (result.code == 200) {
          sign_obj.data.sequence = result.data.sequence;
          this.signmsgs[obj.id] = sign_obj;
          store.set({ signmsgs: this.signmsgs });
          this.sendMsgToPopup(sign_obj, port);
        } else {
          this.sendMsgToPage(
            { ...sign_obj, data: { code: 400, msg: result.msg } },
            port
          );
        }
      } catch (e) {
        delete this.signmsgs[obj.id];
        this.sendMsgToPage(
          { ...sign_obj, data: { code: 400, msg: e.message } },
          port
        );
      }
    }
  }
  /**
   * sign result to page 签名结果发送server, 并发消息到page
   * @param {*} obj
   * @param {*} port
   */
  async sign_result(obj, port) {
    // if (!obj.id && !this.signmsgs[obj.id]) {
    //   console.warn(`sign message has no id = ${obj.id}`);
    //   return;
    // }
    if (this.signmsgs && obj.id) {
      delete this.signmsgs[obj.id];
    }
    store.set({ signmsgs: this.signmsgs });
    // 用户拒绝
    if (obj.data && obj.data.code == 400) {
      this.sendMsgToPage(obj, port);
      return;
    }
    // 用户确认
    try {
      let d = {
        fee: obj.data.fee,
        memo: obj.data.meno,
        msg: obj.data.msgs,
        signatures: obj.data.signatures,
      };
      const result = await request(API.txs, {
        body: JSON.stringify({
          tx: d,
          mode: "sync",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      this.sendMsgToPage({ ...obj, data: result }, port);
    } catch (e) {
      this.sendMsgToPage({ ...obj, data: { code: 400, msg: e.message } }, port);
    }
  }
  // 发消息到page
  async sendMsgToPage(obj, port) {
    let msg = util.packmsg({
      from: CONST.MESSAGE_FROM_BACKGROUND,
      to: CONST.MESSAGE_FROM_PAGE,
      id: obj.id || "",
      type: obj.type,
      tabId: obj.tabId,
      data: obj.data,
    });
    // console.log("send data to page:");
    // console.log(msg);
    this.port.forEach((item) => {
      try {
        item.postMessage(JSON.stringify(msg));
      } catch (e) {}
    });
    return;
  }
  // 发送数据到popup
  async sendMsgToPopup(data) {
    if (!this.popupIsOpen) {
      await this.openPopup();
    }
    setTimeout(() => {
      let back_to_front = false;
      this.port.forEach((item) => {
        try {
          if (
            item.sender &&
            item.sender.tab &&
            !back_to_front &&
            (data.type == CONST.METHOD_SIGN ||
              data.type == CONST.MEHTOD_CONNECT)
          ) {
            this.platform.switchToTab(item.sender.tab.id);
            back_to_front = true;
          }
          item.postMessage(
            JSON.stringify({
              from: CONST.MESSAGE_FROM_BACKGROUND,
              to: CONST.MESSAGE_FROM_POPUP,
              time: new Date().getTime(),
              type: data.type,
              id: data.id,
              data: data.data,
            })
          );
        } catch (e) {}
      });
    }, 100);
  }
  /**
   * updateBadge
   */
  async updateBadge() {
    const count =
      this.logged && Object.keys(this.signmsgs).length
        ? Object.keys(this.signmsgs).length
        : "";
    extension.browserAction.setBadgeText({ text: `${count}` });
    extension.browserAction.setBadgeBackgroundColor({ color: "#037DD6" });

    if (!this.logged) {
      this.signmsgs = {};
    }
    await util.delay(1000);
    this.updateBadge();
  }
  /**
   * login
   */
  async login(obj = {}, port) {
    let datas = await store.get();
    const pwd = obj && obj.data ? obj.data.password : "";
    if (!pwd) {
      this.sendMsgToPopup({
        ...obj,
        data: { code: 400, msg: "Please input password" },
      });
      return;
    }
    const accounts = datas ? datas.accounts : [];
    if (accounts.length == 0) {
      this.sendMsgToPopup({
        ...obj,
        data: { code: 400, msg: "no account" },
      });
      return;
    }
    const index = accounts.findIndex((item) => item.password == pwd);
    if (index == -1) {
      this.sendMsgToPopup({
        ...obj,
        data: { code: 400, msg: "Wrong password" },
      });
      return;
    }
    this.logged = true;
    datas.account_index = index;
    await store.set(datas);
    this.sendMsgToPopup({
      ...obj,
      data: { code: 200, msg: "OK" },
    });
  }
  /**
   * logout
   */
  async logout(obj, port) {
    this.logged = false;
    let datas = await store.get();
    datas.account_index = -1;
    this.signmsgs = {};
    store.set({ ...datas, signmsgs: {} });
  }
  /**
   * save_password 30分钟免密状态记录
   */
  async save_password(obj) {
    this.no_pwd = obj.data.no_pwd;
    this.password = obj.data.password;
    clearTimeout(this.clear_pwd_timer);
    this.reset_pwd(obj.data.no_pwd, obj.data.password);
    if (obj.data.no_pwd) {
      this.clear_pwd_timer = setTimeout(() => {
        this.reset_pwd(false, "");
      }, 30 * 60 * 1000);
    } else {
      this.reset_pwd(false, "");
    }
    this.sendMsgToPopup({ type: obj.type, data: obj.data });
  }
  // reset_pwd
  async reset_pwd(no_pwd, pwd) {
    this.no_pwd = no_pwd;
    this.password = pwd;
    this.sendMsgToPopup({
      type: CONST.METHOD_SAVE_PASSWORD,
      data: { no_pwd, password: pwd },
    });
  }
  async query_password() {
    this.sendMsgToPopup({
      type: CONST.METHOD_QUERY_PASSWORD,
      data: {
        no_pwd: this.no_pwd,
        password: this.password,
      },
    });
  }
}
