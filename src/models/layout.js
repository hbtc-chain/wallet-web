import helper from "../util/helper";
import store from "../util/store";
import CONST from "../config/const";
import route_map from "../config/route_map";
import { routerRedux } from "dva/router";
import MessageManager from "../util/message";
import getData from "../service/getData";
import API from "../util/api";

export default {
  namespace: "layout",

  //
  state: {
    store: {
      /**
       * account : [{
       *  password: "", // 密码
       *  mnemonic: "", // 12词
       *  privateKey: "", // 秘钥
       *  publicKey: "", // 公钥
       *  address: '', // 地址
       *  username: '', 用户名
       * }]
       */
      accounts: [],
      account_index: -1, //  -1 未登录任何账户， >=0 登录accounts[i]的账户
      password: "",
      signmsgs: {},
      sites: [],
    },
    messageManager: null,
    domain: "main",
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const messageManager = new MessageManager(dispatch, history, routerRedux);
      dispatch({
        type: "save",
        payload: {
          messageManager,
        },
      });
      history.listen((location) => {
        const pathname = location.pathname;
        // 判断是否登录
        let r = false;
        route_map.noLogin.map((item) => {
          if (
            (route_map[item] !== "/" &&
              pathname.indexOf(route_map[item]) > -1) ||
            (route_map[item] === "/" && pathname === "/")
          ) {
            r = true;
          }
        });
        // 需登录才可访问的页面
        if (!r) {
          dispatch({
            type: "init",
            payload: {},
            dispatch,
          });
          return;
        }
      });
    },
  },

  effects: {
    // 判断是否要登录
    *init({ dispatch }, { select }) {
      let layout = yield select((state) => state.layout);
      // 无账户
      if (
        (!layout.store.accounts || !layout.store.accounts.length) &&
        window.location.href.indexOf(route_map.welcome) == -1
      ) {
        dispatch(
          routerRedux.push({
            pathname: route_map.welcome,
          })
        );
        return;
      }
      // 未登录
      if (
        layout.store.account_index == -1 &&
        window.location.href.indexOf(route_map.login) == -1
      ) {
        dispatch(
          routerRedux.push({
            pathname: route_map.login,
            search: "?redirect=" + encodeURIComponent(window.location.pathname),
          })
        );
        return;
      }
      // 已登录，有sign请求,跳转sign
      if (
        Object.keys(layout.store.signmsgs || {}).length != 0 &&
        window.location.href.indexOf(route_map.sign) == -1
      ) {
        dispatch(
          routerRedux.push({
            pathname: route_map.sign,
            search: "?id=" + Object.keys(layout.store.signmsgs || {})[0],
          })
        );
      }
    },
    // 创建账户
    *create_account({ payload, dispatch }, { call, put, select }) {
      let password = payload.password;
      if (!password) {
        return;
      }
      const mnemonic = helper.createMnemonic();
      const encrypt_mnemonic = helper.aes_encrypt(mnemonic, password);

      // 生成公钥秘钥
      const keys = helper.createKey(mnemonic, CONST.HBC_PATH);
      const encrypt_privateKey = helper.aes_encrypt(
        Buffer.from(keys.privateKey).toString("hex"),
        password
      );
      const encrypt_publicKey = helper.aes_encrypt(
        Buffer.from(keys.publicKey).toString("hex"),
        password
      );

      // 根据公钥计算address
      const address = helper.createAddress(keys.publicKey);

      // 保存加密后密码，12词，秘钥
      let store = yield select((state) => state.layout.store);
      let accounts = store.accounts;
      const data = {
        address,
        username:
          "Account" + (accounts && accounts.length ? accounts.length + 1 : 1),
        password: helper.sha256(password),
        mnemonic: encrypt_mnemonic,
        privateKey: encrypt_privateKey,
        publicKey: encrypt_publicKey,
      };
      if (accounts && accounts.length) {
        accounts.push(data);
      } else {
        accounts = [data];
      }
      console.log(accounts, password);
      yield put({
        type: "save",
        payload: {
          store: {
            ...store,
            accounts,
            account_index: accounts.length - 1,
            password: password,
          },
        },
      });
    },
    /**
     * commReq
     */
    *commReq({ payload, url, method }, { call, select }) {
      const domain = yield select((state) => state.layout.main);
      return yield call(getData(API.domain[domain] + url), {
        payload,
        method,
      });
    },
  },

  reducers: {
    save(state, action) {
      // 同步数据到background store
      const data = { ...state, ...action.payload };
      store.set(data.store);
      return data;
    },
  },
};
