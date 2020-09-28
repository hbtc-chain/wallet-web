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
    balance: {},
    unit: "usd",
    units: ["cny", "jpy", "krw", "usd", "usdt", "vnd"],
    messageManager: null,
    domain: "main",
    chain_id: "HBTC",
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
      dispatch({
        type: "init",
        payload: {},
        dispatch,
      });
      history.listen((location) => {});
    },
  },

  effects: {
    // 判断是否要登录
    *init({ dispatch }, { select }) {
      let layout = yield select((state) => state.layout);
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
    *create_account({ payload }, { put, select }) {
      let password = payload.password;
      if (!password) {
        return;
      }
      const mnemonic = payload.mnemonic || helper.createMnemonic();
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
    *commReq({ payload, url, method = "GET" }, { call, select }) {
      const domain = yield select((state) => state.layout.main);
      return yield call(getData(API.domain.main + url), {
        payload,
        method,
      });
    },
    *get_balance({ payload }, { put, select }) {
      const balance = yield select((state) => state.layout.balance);
      console.log(payload);
      yield put({
        type: "save",
        payload: {
          balance: {
            ...balance,
            ...payload,
          },
        },
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
