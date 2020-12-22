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

export default {
  namespace: "layout",

  // 初始数据在 /src/index.js
  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      const messageManager = new MessageManager(dispatch, history, routerRedux);
      dispatch({
        type: "save",
        payload: {
          messageManager,
        },
      });
      // dispatch({
      //   type: "init",
      //   payload: {},
      //   dispatch,
      // });
      dispatch({
        type: "default_fee",
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
      history.listen((location) => {
        // 查询signmsgs
        messageManager.sendMessage({
          type: CONST.METHOD_QUERY_SIGN,
          data: {},
        });
        // 查询登录状态
        messageManager.sendMessage({
          type: CONST.METHOD_LOGGED_STATUS_QUERY,
          data: {},
        });
        // 查询免密设置
        // messageManager.sendMessage({
        //   type: CONST.METHOD_QUERY_PASSWORD,
        //   data: {},
        // });
      });
    },
  },

  effects: {
    // 判断是否要登录
    // *init({ dispatch }, { select }) {
    //   let layout = yield select((state) => state.layout);
    //   // 已登录，有sign请求,跳转sign
    //   if (
    //     Object.keys(layout.signmsgs || {}).length != 0 &&
    //     window.location.href.indexOf(route_map.sign) == -1
    //   ) {
    //     dispatch(
    //       routerRedux.push({
    //         pathname: route_map.sign,
    //         search: "?id=" + Object.keys(layout.signmsgs || {})[0],
    //       })
    //     );
    //   }
    // },
    // 查询 default gas fee
    *default_fee({ payload }, { put, call, select }) {
      const store = yield select((state) => state.layout.store);
      const result = yield call(
        getData(store.chain[store.chain_index]["url"] + API.default_fee),
        { payload: {}, method: "get" }
      );
      if (result.code == 200) {
        yield put({
          type: "save",
          payload: {
            default_fee: result.data,
          },
        });
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
      if (payload.way == "key") {
        // 根据私钥解公钥
        keys = helper.createKeyFromPrivateKey(payload.key);
      } else if (payload.way == "keyStore") {
        keys = payload.data;
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
      const address =
        payload.way == "keyStore"
          ? keys.address
          : helper.createAddress(keys.publicKey);

      // 保存加密后密码，12词，秘钥
      let store = yield select((state) => state.layout.store);
      let accounts = store.accounts;
      const data = {
        address,
        username:
          payload.account ||
          "Account" + (accounts && accounts.length ? accounts.length + 1 : 1),
        password: helper.sha256(password),
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
          password_source: password,
        },
      });
    },
    /**
     * 查询 tokens
     */
    *tokens({ payload }, { call, put, select }) {
      const store = yield select((state) => state.layout.store);
      let tokens = yield select((state) => state.layout.tokens);
      const result = yield call(
        getData(
          store.chain[store.chain_index]["url"] +
            API.batch_tokens +
            "/" +
            payload.symbols
        ),
        {
          payload,
          method: "get",
        }
      );
      if (result.code == 200 && result.data) {
        tokens = tokens.concat(Object.values(result.data));
        let newtokens = [];
        let k = {};
        tokens.map((item) => {
          if (!k[item.symbol]) {
            newtokens.push(item);
            k[item.symbol] = 1;
          }
        });
        yield put({
          type: "save",
          payload: {
            tokens: newtokens,
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
      yield util.delay(2000);
      yield put({
        type: "get_balance_loop",
        payload: {},
      });
    },
    *get_rates({ payload }, { call, put, select }) {
      const { tokens, store } = yield select((state) => state.layout);
      if (tokens.length) {
        let symbols = [];
        tokens.map((item) => symbols.push(item.symbol));
        try {
          const result = yield call(
            getData(store.chain[store.chain_index]["url"] + API.tokenprices),
            { payload: { symbols: symbols.join(",") }, method: "post" }
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
      const store = yield select((state) => state.layout.store);
      const tokens = yield select((state) => state.layout.tokens);
      const address =
        store.accounts.length && store.account_index > -1
          ? store.accounts[store.account_index]["address"]
          : "";
      if (address && payload[address]) {
        const assets = payload[address]["assets"];
        let not_in_tokens = [];
        assets.map((item) => {
          const index = tokens.findIndex((it) => it.symbol == item.symbol);
          if (index == -1) {
            not_in_tokens.push(item.symbol);
          }
        });
        if (not_in_tokens.length) {
          yield put({
            type: "tokens",
            payload: {
              symbols: not_in_tokens.join(","),
            },
          });
        }
      }
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
    /**
     * search token
     */
    *search_token({ payload }, { call, put }) {},
    /**
     * query sign
     */
    *sign({ payload }, { put }) {
      const msgs = Object.keys(payload.signmsgs || {});
      yield put({
        type: "save",
        payload: {
          signmsgs: payload.signmsgs,
        },
      });
      if (msgs.length && window.location.href.indexOf(route_map.sign) == -1) {
        yield put(
          routerRedux.push({
            pathname: route_map.sign,
            search: "?id=" + msgs[0],
          })
        );
      }
    },
  },

  reducers: {
    save(state, action) {
      // 同步数据到background store
      const data = { ...state, ...action.payload };
      if (action.payload.store) {
        store.set(data.store);
      }
      if (action.payload.tokens) {
        action.payload.tokens.sort((a, b) => {
          return a.symbol.toUpperCase() > b.symbol.toUpperCase() ? 1 : -1;
        });
        window.localStorage.setItem(
          "hbc_wallet_tokens",
          JSON.stringify(action.payload.tokens)
        );
      }
      return data;
    },
    // 接收广播消息
    broadcast(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
