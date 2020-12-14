// 币 资产流水信息
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  Paper,
  Menu,
  MenuItem,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import API from "../../util/api";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from "moment";
import extension from "extensionizer";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      tokens: [],
      data: [],
      page: 1,
      page_size: 100,
      loading: false,
      hasmore: true,
      open: false,
    };
  }
  componentDidMount() {
    this.get_balance_history();
  }
  get_balance = async () => {};
  get_balance_history = async () => {
    if (this.state.loading) {
      return;
    }
    await this.setState({
      loading: true,
    });
    const symbol = (this.props.match.params.symbol || "").toLowerCase();
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {
        page: this.state.page,
        page_size: 100,
        token: symbol,
        addr: address,
      },
      url: API.cus + `/${address}/txs`,
    });
    if (result.code == 200) {
      this.setState({
        data: this.state.data.concat(result.data.items),
        loading: false,
        page: 1 + this.state.page,
        hasmore: Boolean(result.data.items.length == this.state.page_size),
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  };
  rates = (v, t) => {
    if (Number(v) && t) {
      const d = helper.rates(v, t, this.props.store.unit, this.props.rates);
      return d;
    }
    return ["", "", ""];
  };
  goto = (hash) => (e) => {
    // open window tab
    window.open("http://explorer.hbtcchain.io/txs/" + hash, "_blank");
  };
  render() {
    const { classes } = this.props;
    const symbol = (this.props.match.params.symbol || "").toLowerCase();
    const token = this.props.tokens.find(
      (item) => item.symbol.toLowerCase() == symbol
    );
    let tokens = [];
    this.props.tokens.map((item) => {
      if (token && item.chain == token.chain) {
        tokens.push(item.symbol);
      }
    });
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balance =
      this.props.balance && address && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == symbol
          ) || {
            amount: "",
          }
        : { amount: "" };
    let external_address = "";
    const assets =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address]["assets"]
        : [];
    assets.map((it) => {
      const t = this.props.tokens.find((i) => i.symbol == it.symbol);
      if (t && token && t.chain == token.chain && it.external_address) {
        external_address = it.external_address;
      }
    });
    const rates = this.rates(balance.amount, symbol);
    return (
      <div className={classes.symbol}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.back}
        >
          <Grid item xs={2}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>{token ? token.name.toUpperCase() : ""}</h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Paper className={classes.symbol_paper}>
          <div className={classes.symbol_amount}>
            <p>{this.props.intl.formatMessage({ id: "currently held" })}</p>
            <strong>{balance.amount || "--"}</strong>
            <span>
              {rates[2]} {rates[0]} {(rates[1] || "").toUpperCase()}
            </span>
            {token && token.logo ? <img src={token.logo} /> : ""}
          </div>
          {symbol == "hbc" ? (
            <div style={{ padding: "10px 0 8px" }}>
              <Grid
                container
                justify="space-between"
                className={classes.symbol_amount_item}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "available" })}
                </Grid>
                <Grid item>{balance.amount || "--"}</Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.symbol_amount_item}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "bonded" })}
                </Grid>
                <Grid item>
                  {this.props.balance && this.props.balance[address]
                    ? this.props.balance[address].bonded
                    : "--"}
                </Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.symbol_amount_item}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "unbonding" })}
                </Grid>
                <Grid item>
                  {this.props.balance && this.props.balance[address]
                    ? this.props.balance[address].unbonding
                    : "--"}
                </Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.symbol_amount_item}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "claimed_reward" })}
                </Grid>
                <Grid item>
                  {this.props.balance && this.props.balance[address]
                    ? this.props.balance[address].claimed_reward
                    : "--"}
                </Grid>
              </Grid>
            </div>
          ) : (
            ""
          )}
        </Paper>
        <div className={classes.token_list} style={{ paddingBottom: 90 }}>
          {this.state.data.map((item) => {
            // 过滤自己给自己转账的记录
            if (
              item.balance_flows.length == 1 &&
              item.balance_flows[0]["amount"] == 0 &&
              item.balance_flows[0]["address"] == address &&
              item.balance_flows[0]["symbol"] == symbol
            ) {
              return "";
            }
            const flow = item.balance_flows
              ? item.balance_flows.find((it) => it.address == address) || {
                  amount: "",
                  symbol: "",
                }
              : { amount: "", symbol: "" };
            const rates =
              flow && Number(flow.amount) && flow.symbol
                ? this.rates(Math.abs(Number(flow.amount)), flow.symbol)
                : ["", "", ""];
            return (
              <Grid
                container
                key={item.symbol}
                alignItems="center"
                justify="space-between"
                className={classes.token_item}
                onClick={this.goto(item.hash)}
                key={item.hash}
              >
                <Grid item>
                  <strong>
                    {this.props.intl.formatMessage({
                      id:
                        item.activities && item.activities
                          ? item.activities[0]["type"]
                          : "other",
                    })}
                  </strong>
                  <i className={item.success ? "native" : ""}>
                    {this.props.intl.formatMessage({
                      id: item.success ? "success" : "error",
                    })}
                  </i>
                  <p>
                    {moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </Grid>
                <Grid item style={{ textAlign: "right" }}>
                  <strong style={{ fontSize: 14 }}>
                    {flow.amount} {(flow.symbol || "").toUpperCase()}
                  </strong>
                  <br />
                  <span className={classes.grey500}>
                    {rates[2]}
                    {rates[0]}
                    {rates[1]}
                  </span>
                </Grid>
              </Grid>
            );
          })}
        </div>
        {!this.state.loading && !this.state.data.length ? (
          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.nodata}
          >
            <Grid item>
              <img src={require("../../assets/nodata.png")} />
              <p>{this.props.intl.formatMessage({ id: "nodata" })}</p>
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {this.state.hasmore && !this.state.loading && this.state.data.length ? (
          <Grid container justify="center">
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={this.get_balance_history}
              >
                {this.props.intl.formatMessage({ id: "more data" })}
              </Button>
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        <Grid
          container
          justify="space-around"
          alignItems="center"
          className={classes.btns}
        >
          <Grid
            item
            onClick={() => {
              this.props.dispatch(
                routerRedux.push({
                  pathname: route_map.accept_by_type + `/${token.symbol}`,
                })
              );
            }}
          >
            <span>
              <img src={require("../../assets/btn-1.png")} width={24} />
            </span>
            <i>{this.props.intl.formatMessage({ id: "accept" })}</i>
          </Grid>
          <Grid
            item
            onClick={() => {
              this.props.dispatch(
                routerRedux.push({
                  pathname: route_map.transfer + "/" + symbol,
                })
              );
            }}
          >
            <span>
              <img src={require("../../assets/btn-2.png")} width={24} />
            </span>
            <i>{this.props.intl.formatMessage({ id: "output" })}</i>
          </Grid>
          <Grid
            item
            onClick={() => {
              extension.tabs &&
                extension.tabs.create({
                  url:
                    this.props.store.chain[this.props.store.chain_index][
                      "exc"
                    ] +
                    "/swap" +
                    "?lang=" +
                    this.props.store.lang,
                });
            }}
          >
            <span>
              <img src={require("../../assets/btn-4.png")} width={24} />
            </span>
            <i>{this.props.intl.formatMessage({ id: "trade" })}</i>
          </Grid>
          {token && !token.is_mapping_token ? (
            <Grid
              item
              onClick={(e) => {
                this.setState({
                  open: this.state.open ? null : e.target,
                });
              }}
            >
              <span>
                <img src={require("../../assets/btn-4.png")} width={24} />
              </span>
              <i>
                {this.props.intl.formatMessage({
                  id: "hbtcchain/mapping/MsgMappingSwap",
                })}
              </i>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
