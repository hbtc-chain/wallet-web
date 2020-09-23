const host = "https://explorer.hbtc.com";

// local
if (/^local/.test(window.location.hostname)) {
  host = "https://explorer.hbtc.com";
}

export default {
  // swap配置参数
  swap_config: `${host}/api/v1/swap/parameters`,
};
