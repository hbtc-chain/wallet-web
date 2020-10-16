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
    const token = this.props.tokens.find((item) => item.symbol == symbol);
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
              {rates[0]} {rates[1]}
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
                <Grid item>{balance.amount}</Grid>
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
                  {this.props.balance ? this.props.balance.bonded : ""}
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
                  {this.props.balance ? this.props.balance.unbonding : ""}
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
        <div className={classes.token_list}>
          {this.state.data.map((item) => {
            return (
              <Grid
                container
                key={item.symbol}
                alignItems="center"
                justify="space-between"
                className={classes.token_item}
                onClick={this.goto(item.symbol)}
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
                </Grid>
                <Grid item style={{ textAlign: "right" }}>
                  <strong>{item.amount}</strong>
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
          <Grid item>
            <span>x</span>
            <i>{this.props.intl.formatMessage({ id: "accept" })}</i>
          </Grid>
          <Grid item>
            <span>xx</span>
            <i>{this.props.intl.formatMessage({ id: "output" })}</i>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
