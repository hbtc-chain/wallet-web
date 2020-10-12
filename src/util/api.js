const DOMAIN = {
  main: "http://juswap.io",
  test: "http://juswap.io",
};

export default {
  liquidity: `/api/v1/swap/liquidity`,
  pairs: `/api/v1/swap/pairs`,
  cus: `/api/v1/cus`,
  tokens: `/api/v1/tokens`,
  token_txs: "/api/v1/tokens/${token}/txs", // 币 资产变动记录
  domain: DOMAIN,
  txs: `/api/v1/txs`,
  tokenprices: `/api/v1/tokenprices`,
};
