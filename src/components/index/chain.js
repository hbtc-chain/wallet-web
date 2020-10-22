// 链信息
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
  Avatar,
  Drawer,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { v4 } from "uuid";
import util from "../../util/util";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import GradientIcon from "@material-ui/icons/Gradient";
import { CopyToClipboard } from "react-copy-to-clipboard";
import message from "../public/message";
import Qrcode from "qrcode";
import CloseIcon from "@material-ui/icons/Close";
import { Iconfont } from "../../lib";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      tokens: [],
      chain_external_address: "",
      open: false,
      choose: {
        logo: "",
        symbol: "",
        title: "",
        address: "",
      },
    };
  }
  componentDidMount() {
    this.get_balance();
    this.qrcode(this.state.choose.address);
  }
  get_balance = async () => {
    const chainId = this.props.match.params.chainId;

    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balances =
      this.props.balance && address && this.props.balance[address]
        ? this.props.balance[address] || { assets: [] }
        : { assets: [] };
    const balances_json = {};
    let chain_external_address = "";
    balances.assets.map((item) => {
      balances_json[item.symbol] = item;
    });
    let tokens = [];
    this.props.tokens.map((item) => {
      if (item.chain.toUpperCase() == chainId.toUpperCase()) {
        if (balances_json[item.symbol]) {
          chain_external_address = balances_json[item.symbol].external_address;
        }
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
    await util.delay(1000);
    this.get_balance();
  };
  rates = (v, t) => {
    return helper.rates(v, t, this.props.store.unit, this.props.rates);
  };
  short_address = (str, n = 8) => {
    if (!str) {
      return "";
    }
    if (str.length < 2 * n) {
      return str;
    }
    const s = str.match(/^(.{8})(.{0,})(.{8})$/);
    return s[1] + "..." + s[3];
  };
  copy = () => {
    message.success(this.props.intl.formatMessage({ id: "copyed" }));
  };
  qrcode = async (str) => {
    if (!str) {
      return "";
    }
    if (this.state[str]) {
      return this.state[str];
    }
    const img = await Qrcode.toDataURL(str, { width: 520 });
    this.setState({
      [str]: img,
    });
  };
  choose = (symbol, title, address) => () => {
    this.qrcode(address);
    this.setState({
      choose: {
        symbol,
        title,
        address,
      },
      open: true,
    });
  };
  goto = (symbol) => () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.symbol + "/" + symbol,
      })
    );
  };
  render() {
    const { classes } = this.props;
    const symbol = this.props.match.params.chainId;
    const address =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]["address"]
        : "";
    const chain_external_address = this.state.chain_external_address;

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
          <Grid item>
            <h2>{symbol.toUpperCase()}</h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div className={classes.form}>
          {this.state.tokens.length && this.state.tokens[0].is_native ? (
            <Paper square={0} style={{ margin: "0 0 6px" }}>
              <div className={classes.chain_symbol}>
                <h2>{symbol.toUpperCase()}</h2>
                <p>
                  {this.props.intl.formatMessage({ id: "HBC chain address" })}
                </p>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item style={{ flex: 1 }}>
                    {this.short_address(
                      this.props.store.accounts &&
                        this.props.store.account_index > -1
                        ? this.props.store.accounts[
                            this.props.store.account_index
                          ]["address"]
                        : ""
                    )}
                  </Grid>
                  <Grid item>
                    <CopyToClipboard text={address} onCopy={this.copy}>
                      <Iconfont type="copy" />
                    </CopyToClipboard>
                  </Grid>
                  <Grid item>
                    <Iconfont
                      type="QRcode"
                      onClick={this.choose(
                        symbol,
                        "HBC chain address",
                        address
                      )}
                    />
                  </Grid>
                </Grid>
              </div>
            </Paper>
          ) : (
            ""
          )}
          {this.state.tokens.length && !this.state.tokens[0].is_native ? (
            <Paper
              square={0}
              style={{ padding: "0 0 10px", margin: "0 0 6px" }}
            >
              <div className={classes.chain_symbol}>
                <h2>{symbol.toUpperCase()}</h2>
              </div>
              <div className={classes.chain_address}>
                <p>
                  {this.props.intl.formatMessage({ id: "HBC chain address" })}
                </p>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item style={{ flex: 1 }}>
                    <span>
                      {this.short_address(
                        this.props.store.accounts &&
                          this.props.store.account_index > -1
                          ? this.props.store.accounts[
                              this.props.store.account_index
                            ]["address"]
                          : ""
                      )}
                    </span>
                  </Grid>
                  <Grid item>
                    <CopyToClipboard text={address} onCopy={this.copy}>
                      <Iconfont type="copy" size={24} />
                    </CopyToClipboard>
                  </Grid>
                  <Grid item>
                    <Iconfont
                      type="QRcode"
                      size={24}
                      onClick={this.choose(
                        symbol,
                        "HBC chain address",
                        address
                      )}
                    />
                  </Grid>
                </Grid>
              </div>
              <div className={classes.chain_address} style={{ border: 0 }}>
                <p>
                  {this.props.intl.formatMessage({ id: "external address" })}
                </p>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item style={{ flex: 1 }}>
                    {chain_external_address ? (
                      <span>
                        {this.short_address(
                          this.state.chain_external_address &&
                            this.state.tokens.length
                            ? this.state.chain_external_address
                            : ""
                        )}
                      </span>
                    ) : (
                      <em
                        onClick={() => {
                          this.props.dispatch(
                            routerRedux.push({
                              pathname:
                                route_map.external_address + "/" + symbol,
                            })
                          );
                        }}
                      >
                        {this.props.intl.formatMessage({
                          id: "create external address",
                        })}
                      </em>
                    )}
                  </Grid>
                  {chain_external_address ? (
                    <Grid item>
                      <CopyToClipboard
                        text={chain_external_address}
                        onCopy={this.copy}
                      >
                        <Iconfont type="copy" size={24} />
                      </CopyToClipboard>
                    </Grid>
                  ) : (
                    ""
                  )}
                  {chain_external_address ? (
                    <Grid item>
                      <Iconfont
                        type="QRcode"
                        size={24}
                        onClick={this.choose(
                          symbol,
                          "external chain address",
                          chain_external_address
                        )}
                      />
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </div>
            </Paper>
          ) : (
            ""
          )}

          <div className={classes.token_list}>
            {this.state.tokens.map((item) => {
              const rates2 = this.rates(
                1,
                item.symbol,
                this.props.store.unit,
                this.props.rates
              );
              const rates = this.rates(
                item.amount,
                item.symbol,
                this.props.store.unit,
                this.props.rates
              );
              return (
                <Grid
                  container
                  key={item.symbol}
                  alignItems="center"
                  justify="space-between"
                  className={classes.token_item}
                  onClick={this.goto(item.symbol)}
                >
                  <Grid item>
                    {item.logo ? (
                      <img src={item.logo} />
                    ) : (
                      <Avatar className={classes.avatar}>
                        {item.symbol.split("")[0].toUpperCase()}
                      </Avatar>
                    )}
                  </Grid>
                  <Grid item style={{ flex: 1, margin: "0 0 0 12px" }}>
                    <strong>{item.symbol.toUpperCase()}</strong>
                    {item.symbol != "hbc" ? (
                      <i className={item.is_native ? "native" : ""}>
                        {this.props.intl.formatMessage({
                          id: item.is_native ? "native" : "not native",
                        })}
                      </i>
                    ) : (
                      ""
                    )}
                    <p>
                      {rates[2]}
                      {rates2[0]}
                      {(rates2[1] || "").toUpperCase()}
                    </p>
                  </Grid>
                  <Grid item style={{ textAlign: "right" }}>
                    <strong>{item.amount}</strong>
                    <p>
                      ≈ {rates[2]} {rates[0]} {(rates[1] || "").toUpperCase()}
                    </p>
                  </Grid>
                </Grid>
              );
            })}
          </div>
        </div>
        <Drawer
          anchor="bottom"
          open={this.state.open}
          onClose={() => {
            this.setState({ open: !this.state.open });
          }}
          classes={{
            paper: classes.drawer_paper,
          }}
        >
          <div className={classes.drawer}>
            <div className={classes.drawer_title}>
              {this.state.choose.logo ? (
                <img src={this.state.choose.logo} />
              ) : (
                <Avatar>
                  {(this.state.choose.symbol || "H").split("")[0].toUpperCase()}
                </Avatar>
              )}
            </div>
            <h2>
              {this.state.choose.title
                ? this.props.intl.formatMessage({ id: this.state.choose.title })
                : ""}
            </h2>
            {this.state.choose.address &&
            this.state[this.state.choose.address] ? (
              <img src={this.state[this.state.choose.address]} />
            ) : (
              ""
            )}
            <p>{this.state.choose.address}</p>
            <CopyToClipboard
              text={this.state.choose.address}
              onCopy={this.copy}
            >
              <Button
                fullWidth
                color="primary"
                variant="outlined"
                style={{ height: 56, fontSize: 16 }}
              >
                {this.props.intl.formatMessage({ id: "copy address" })}
              </Button>
            </CopyToClipboard>
            <CloseIcon
              className={classes.icon_close}
              onClick={() => {
                this.setState({
                  open: false,
                });
              }}
            />
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
