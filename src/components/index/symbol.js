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
import querystring from "query-string";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { v4 } from "uuid";
import util from "../../util/util";
import API from "../../util/api";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from "moment";

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
        page: 1,
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
    return ["", this.props.store.unit];
  };
  goto = (hash) => (e) => {
    // open window tab
    window.open("http://explorer.hbtcchain.io/txs/" + hash, "_blank");
  };
  render() {
    const { classes } = this.props;
    const symbol = (this.props.match.params.symbol || "").toLowerCase();
    const token = this.props.tokens.find((item) => item.symbol == symbol);
    let tokens = [];
    this.props.tokens.map((item) => {
      if (item.chain == token.chain) {
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
            <h2>{this.props.match.params.symbol.toUpperCase()}</h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Paper className={classes.symbol_paper}>
          <div className={classes.symbol_amount}>
            <p>{this.props.intl.formatMessage({ id: "currently held" })}</p>
            <strong>{balance.amount || "--"}</strong>
            <span>
              {rates[0]} {(rates[1] || "").toUpperCase()}
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
                <Grid item>{this.props.balance.bonded || "--"}</Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.symbol_amount_item}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "unbonding" })}
                </Grid>
                <Grid item>{this.props.balance.unbonding || "--"}</Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.symbol_amount_item}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "claimed_reward" })}
                </Grid>
                <Grid item>{this.props.balance.claimed_reward || "--"}</Grid>
              </Grid>
            </div>
          ) : (
            ""
          )}
        </Paper>
        <div className={classes.token_list} style={{ paddingBottom: 90 }}>
          {this.state.data.map((item) => {
            const flow = item.balance_flows
              ? item.balance_flows.find((it) => it.address == address) || {
                  amount: "",
                  symbol: "",
                }
              : { amount: "", symbol: "" };
            const rates =
              flow && Number(flow.amount) && flow.symbol
                ? this.rates(Math.abs(Number(flow.amount)), flow.symbol)
                : ["", ""];
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
                  <strong>
                    {flow.amount} {(flow.symbol || "").toUpperCase()}
                  </strong>
                  <br />
                  <span className={classes.grey500}>
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
        {this.state.hasmore && !this.state.loading ? (
          <Grid container justify="center">
            <Grid item>
              <Button color="primary" variant="contained">
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
                  pathname:
                    route_map.accept_by_type +
                    `/${token.symbol}/${address}/${
                      token.is_native ? "native" : "chain_in"
                    }`,
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
          {token && !token.is_native ? (
            <Grid
              item
              onClick={(e) => {
                this.setState({
                  open: this.state.open ? null : e.target,
                });
              }}
            >
              <span className="cross">
                <img src={require("../../assets/btn-3.png")} width={24} />{" "}
                <ExpandMoreIcon />
              </span>
              <i>{this.props.intl.formatMessage({ id: "cross chain" })}</i>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
        <Menu
          anchorEl={this.state.open}
          open={Boolean(this.state.open)}
          keepMounted
          onClose={() => {
            this.setState({ open: false });
          }}
        >
          <MenuItem
            onClick={() => {
              this.props.dispatch(
                routerRedux.push({
                  pathname: external_address
                    ? route_map.accept_by_type +
                      "/" +
                      symbol +
                      "/" +
                      external_address +
                      "/chain_out"
                    : route_map.external_address + "/" + symbol,
                })
              );
            }}
          >
            {this.props.intl.formatMessage({ id: "cross chain accept" })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.props.dispatch(
                routerRedux.push({
                  pathname: route_map.withdrawal + "/" + symbol,
                })
              );
            }}
          >
            {this.props.intl.formatMessage({ id: "cross chain withdrawl" })}
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
