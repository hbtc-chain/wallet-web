const local = ""; // :lang or '' 多语言是否配置在路径中

export default {
  // 未登录，允许访问的地址
  noLogin: [
    "login",
    "welcome",
    "create_account_step1",
    "create_account_step2",
    "create_account_step3",
    "create_account_step4",
    "account_import",
  ],

  // login
  login: `${local}/login`,
  // 首页
  index: `${local}/`,
  // 欢迎页
  welcome: `${local}/welcome`,
  setting: `${local}/setting`,
  create_account_step1: `${local}/create_account_step1`,
  create_account_step2: `${local}/create_account_step2`,
  create_account_step3: `${local}/create_account_step3`,
  create_account_step4: `${local}/create_account_step4`,
  account_seed: `${local}/account_seed`,
  account_import: `${local}/account_import`,
  account_import_list: `${local}/account_import_list`,
  create_account_done: `${local}/create_account_done`,
  sign: `${local}/sign`,
  connect: `${local}/connect`,
  chain: `${local}/chain`,
  symbol: `${local}/symbol`,
  transfer: `${local}/transfer`,
  send: `${local}/send`,
  external_address: `${local}/external_address`,
  withdrawal: `${local}/withdrawal`,
  accept: `${local}/accept`,
  accept_by_type: `${local}/accept_by_type`,
  export: `${local}/export`,
  export_list: `${local}/export_list`,
  account_choose: `${local}/account_choose`,
};
