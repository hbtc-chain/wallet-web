import helper from "../util/helper";
import store from "../util/store";
import CONST from "../util/const";
import route_map from "../config/route_map";
import { routerRedux } from "dva/router";
import MessageManager from "../util/message";
import getData from "../service/getData";
import API from "../util/api";
import { v4 } from "uuid";
import util from "../util/util";
const secp256k1 = require("secp256k1");

export default {
  namespace: "layout",

  // 初始数据在 /src/index.js
  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      const messageManager = new MessageManager(dispatch, history, routerRedux);
      // 查询登录状态
      messageManager.sendMessage({
        type: CONST.METHOD_LOGGED_STATUS_QUERY,
        data: {},
      });
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
      dispatch({
        type: "tokens",
        payload: {},
      });
      dispatch({
        type: "get_rates_loop",
        payload: {},
      });
      dispatch({
        type: "get_balance_loop",
        payload: {},
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
      let keys = {};
      if (payload.key) {
        // 根据私钥解公钥
        keys = helper.createKeyFromPrivateKey(payload.key);
      } else {
        // 生成公钥秘钥
        keys = helper.createKey(mnemonic, CONST.HBC_PATH);
      }
      const encrypt_privateKey = helper.aes_encrypt(
        Buffer.from(keys.privateKey).toString("hex"),
        password
      );
      const encrypt_publicKey = helper.aes_encrypt(
        Buffer.from(keys.publicKey).toString("hex"),
        password
      );
      // const encrypt_chainCode = helper.aes_encrypt(
      //   Buffer.from(keys.chainCode).toString("hex"),
      //   password
      // );

      // 根据公钥计算address
      const address = helper.createAddress(keys.publicKey);

      // 保存加密后密码，12词，秘钥
      let store = yield select((state) => state.layout.store);
      let accounts = store.accounts;
      const data = {
        address,
        username:
          payload.account ||
          "Account" + (accounts && accounts.length ? accounts.length + 1 : 1),
        password:
          accounts && accounts.length ? password : helper.sha256(password),
        mnemonic: payload.key ? "" : encrypt_mnemonic,
        privateKey: encrypt_privateKey,
        publicKey: encrypt_publicKey,
        // chainCode: encrypt_chainCode,
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
          },
        },
      });
      // 执行登录
      const messageManager = yield select(
        (state) => state.layout.messageManager
      );
      messageManager.sendMessage({
        type: CONST.METHOD_LOGIN,
        data: {
          password: helper.sha256(password),
        },
      });
    },
    /**
     * 查询 tokens
     */
    *tokens({ payload }, { call, put, select }) {
      const store = yield select((state) => state.layout.store);
      const result = yield call(
        getData(store.chain[store.chain_index]["url"] + API.tokens),
        {
          payload: {},
          method: "get",
        }
      );
      if (result.code == 200 && result.data && result.data.items) {
        yield put({
          type: "save",
          payload: {
            tokens: result.data.items || [],
          },
        });
        yield put({
          type: "get_rates",
          payload: {},
        });
      }
    },
    /**
     * commReq
     */
    *commReq(
      { payload, url, method = "GET", ...otherProps },
      { call, select }
    ) {
      const store = yield select((state) => state.layout.store);
      return yield call(getData(store.chain[store.chain_index]["url"] + url), {
        payload,
        method,
        ...otherProps,
      });
    },
    *get_balance_loop({ payload }, { call, put, select }) {
      const messageManager = yield select(
        (state) => state.layout.messageManager
      );
      if (messageManager) {
        messageManager.sendMessage({
          type: CONST.METHOD_GET_BALANCE,
          data: {},
          id: v4(),
        });
      }
      yield util.delay(1000);
      yield put({
        type: "get_balance_loop",
        payload: {},
      });
    },
    *get_rates({ payload }, { call, put, select }) {
      const { tokens, store } = yield select((state) => state.layout);
      if (tokens.length) {
        try {
          let symbols = [];
          tokens.map((item) => symbols.push(item.symbol));
          const result = yield call(
            getData(store.chain[store.chain_index]["url"] + API.tokenprices),
            { payload: { symbols: symbols.join(",") } }
          );
          let rates = {};
          if (result.code == 200 && result.data) {
            result.data.map((item) => {
              rates[item.token] = item.rates;
            });
          }
          yield put({
            type: "save",
            payload: {
              rates,
            },
          });
        } catch (e) {}
      }
    },
    *get_rates_loop({ payload }, { put, call }) {
      try {
        yield put({
          type: "get_rates",
          payload: {},
        });
      } catch (e) {}
      yield util.delay(5000);
      yield put({
        type: "get_rates",
        payload: {},
      });
    },
    *get_balance({ payload }, { put, select }) {
      const balance = yield select((state) => state.layout.balance);
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
