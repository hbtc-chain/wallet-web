// 币 资产流水信息
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Grid, TextField, Checkbox, Paper } from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { v4 } from "uuid";
import util from "../../util/util";
import API from "../../util/api";

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
    if (this.props.tokens[this.state.i]) {
      const d = helper.rates(v, t, this.props.store.unit, this.state.rates);
      return d;
    }
    return ["", this.props.store.unit];
  };
  render() {
    const { classes } = this.props;
    const symbol = (this.props.match.params.symbol || "").toLowerCase();
    const balance =
      this.props.balance && this.props.balance.assets
        ? this.props.balance.assets.find((item) => item.symbol == symbol)
        : { amount: "" };
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
          <Grid item>{this.props.match.params.symbol}</Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Paper>
          <p>{this.props.intl.formatMessage({ id: "currently held" })}</p>
          <strong>{balance.amount}</strong>
          <span>
            {rates[0]} {rates[1]}
          </span>
          {symbol == "hbc" ? (
            <div>
              <Grid container justify="space-between">
                <Grid item>
                  {this.props.intl.formatMessage({ id: "available" })}
                </Grid>
                <Grid item>{balance.amount}</Grid>
              </Grid>
              <Grid container justify="space-between">
                <Grid item>
                  {this.props.intl.formatMessage({ id: "bonded" })}
                </Grid>
                <Grid item>
                  {this.props.balance ? this.props.balance.bonded : ""}
                </Grid>
              </Grid>
              <Grid container justify="space-between">
                <Grid item>
                  {this.props.intl.formatMessage({ id: "unbonding" })}
                </Grid>
                <Grid item>
                  {this.props.balance ? this.props.balance.unbonding : ""}
                </Grid>
              </Grid>
              <Grid container justify="space-between">
                <Grid item>
                  {this.props.intl.formatMessage({ id: "claimed_reward" })}
                </Grid>
                <Grid item>
                  {this.props.balance ? this.props.balance.claimed_reward : ""}
                </Grid>
              </Grid>
            </div>
          ) : (
            ""
          )}
        </Paper>
        <div>
          {this.state.data.map((item) => {
            return (
              <div key={item.hash}>
                {this.props.intl.formatMessage({
                  id:
                    item.activities && item.activities
                      ? item.activities[0]["type"]
                      : "other",
                })}{" "}
                {item.success} {item.time}
              </div>
            );
          })}
        </div>
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
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
