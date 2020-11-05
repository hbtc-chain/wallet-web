import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import dva from "dva";
import { IntlProvider, addLocaleData } from "react-intl";
import { createHashHistory } from "history";
import createLoading from "dva-loading";

import Store from "./util/store";
// models
import Layout from "./models/layout";
// routes
import Routes from "./router";

async function getLocale(lang, cb) {
  let result = {};
  switch (lang) {
    case "zh-cn":
      result = await import("./locales/zh-cn");
      break;
    case "en-us":
      result = await import("./locales/en-us");
      break;
    // case "ja-jp":
    //   result = await import("./locales/ja-jp");
    //   break;
    // case "ru-ru":
    //   result = await import("./locales/ru-ru");
    //   break;
    // case "ko-kr":
    //   result = await import("./locales/ko-kr");
    //   break;
    // case "es":
    //   result = await import("./locales/es-es");
    //   break;
    default:
      result = await import("./locales/en-us");
  }
  setTimeout(() => {
    cb(result.default || result);
  }, 0);
}
function browserLang() {
  var ls = navigator.languages ? navigator.languages.length : 0;
  var res = (ls
    ? navigator.languages[0]
    : navigator.language || navigator.userLanguage
  ).toLowerCase();
  if (res != "zh-cn") {
    res = "en-us";
  }
  return res;
}

function start(initstore, lang) {
  // 1. Initialize
  const data = {
    initialState: initstore,
    history: createHashHistory(),
    //onAction: createLogger(),
    onError(e) {
      window.console.log(e);
    },
  };
  const app = dva(data);

  // 2. Plugins
  app.use(createLoading());

  // 3. Model
  app.model(Layout);

  // 4. Router
  app.router(Routes);

  // 5. Start
  const App = app.start();

  getLocale(lang, function (appLocale) {
    addLocaleData(...appLocale.data);
    ReactDOM.render(
      <IntlProvider
        locale={appLocale.locale}
        messages={appLocale.messages}
        formats={appLocale.formats}
      >
        <App />
      </IntlProvider>,
      document.querySelector("#root")
    );
  });
}
const initStore = async () => {
  let res = await Store.get();

  // 数据在 /public/scripts/store.js中进行初始化，以下为本地开发用
  if (window.location.href.indexOf("localhost") > -1) {
    res = Object.assign(
      {
        accounts: [],
        account_index: -1,
        sites: [],
        unit: "usd",
        pwd_rule: 0,
        no_pwd: false, // 30m内免密
        password: "",
        lang: browserLang(),
        chain: [
          {
            name: "main net",
            url: "https://explorer.hbtcchain.io",
            chain_id: "hbtc-testnet",
            exc: "https://juswap.io/",
            explorer: "https://explorer.hbtcchain.io/account/",
          },
          {
            name: "test net",
            url: "https://explorer.hbtcchain.io",
            chain_id: "hbtc-testnet",
            exc: "https://juswap.io/",
            explorer: "https://explorer.hbtcchain.io/account/",
          },
        ],
        chain_index: 1,
      },
      res
    );
  }
  start(
    {
      layout: {
        store: res || {},
        no_pwd: false, // 30m内免密
        password: "",
        signmsgs: {},
        rates: {},
        balance: {},
        tokens: JSON.parse(
          window.localStorage.getItem("hbc_wallet_tokens") || "[]"
        ),
        default_tokens: [],
        verified_tokens: [],
        units: ["cny", "jpy", "krw", "usd", "usdt", "vnd"],
        langs: ["zh-cn", "en-us"],
        messageManager: null,
        logged: window.location.href.indexOf("localhost") > -1 ? true : false,
      },
    },
    res ? res.lang : "zh-cn"
  );
};

initStore();
