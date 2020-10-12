// 链信息
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Grid, TextField, Checkbox } from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { v4 } from "uuid";
import util from "../../util/util";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      tokens: [],
      chain_external_address: {},
    };
  }
  componentDidMount() {
    this.get_balance();
  }
  get_balance = async () => {
    const chainId = this.props.match.params.chainId;

    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balances =
      this.props.balance && address && this.props.balance[address]
        ? this.props.balance[address]
        : { assets: [] };
    const balances_json = {};
    const chain_external_address = {};
    balances.assets.map((item) => {
      balances_json[item.symbol] = item;
      chain_external_address[item.chain] = item.external_address;
    });
    let tokens = [];
    this.props.tokens.map((item) => {
      if (item.chain.toUpperCase() == chainId.toUpperCase()) {
        tokens.push({
          ...item,
          amount: balances_json[item.symbol]
            ? balances_json[item.symbol].amount
            : 0,
          chain_external_address: balances_json[item.symbol]
            ? balances_json[item.symbol].external_address
            : "",
        });
      }
    });
    tokens.sort((a, b) => {
      if (a.amount == b.amount) {
        return a.symbol.toUpperCase() >= b.symbol.toUpperCase() ? 1 : -1;
      }
      return a.amount - b.amount >= 0 ? -1 : 1;
    });
    this.setState({
      tokens,
      chain_external_address,
    });
    await util.delay(2000);
    this.get_balance();
  };
  rates = (v, t) => {
    if (this.props.tokens[this.state.i]) {
      const d = helper.rates(v, t, this.props.store.unit, this.state.rates);
      return d;
    }
    return ["", this.props.store.unit];
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.chain}>
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
          <Grid item>{this.props.match.params.chainId}</Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        {this.state.tokens.length && this.state.tokens[0].is_native ? (
          <div>
            hbc address:{" "}
            {this.props.store.accounts && this.props.store.account_index > -1
              ? this.props.store.accounts[this.props.store.account_index][
                  "address"
                ]
              : ""}
            <br />
            external_address :{" "}
            {this.state.chain_external_address[this.state.tokens[0]["chain"]]}
          </div>
        ) : (
          ""
        )}
        {this.state.tokens.length && !this.state.tokens[0].is_native ? (
          <div></div>
        ) : (
          ""
        )}
        <div>
          {this.state.tokens.map((item) => {
            const rates2 = this.rates(
              1,
              item.symbol,
              this.props.store.unit,
              this.state.rates
            );
            const rates = this.rates(
              item.amount,
              item.symbol,
              this.props.store.unit,
              this.state.rates
            );
            return (
              <div key={item.symbol}>
                {item.symbol}{" "}
                {this.props.intl.formatMessage({
                  id: item.is_native ? "native" : "not native",
                })}{" "}
                {rates2[0]}
                {rates2[1]} <br /> {item.amount} {rates[0]}
                {rates[1]}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
