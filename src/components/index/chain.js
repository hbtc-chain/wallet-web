// 链信息
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Grid, Paper, Avatar, Drawer } from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import util from "../../util/util";
import { CopyToClipboard } from "react-copy-to-clipboard";
import message from "../public/message";
import Qrcode from "qrcode";
import CloseIcon from "@material-ui/icons/Close";
import { Iconfont } from "../../lib";
import classnames from "classnames";
import extension from "extensionizer";

let timer = null;
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
    timer = true;
    this.get_balance();
    this.qrcode(this.state.choose.address);
  }
  componentWillUnmount() {
    timer = false;
  }
  get_balance = async () => {
    if (!timer) {
      return;
    }
    const chainId = this.props.match.params.chainId;
    let chain_external_address = "";
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balances =
      this.props.balance && address && this.props.balance[address]
        ? this.props.balance[address] || { assets: [] }
        : { assets: [] };
    const balances_json = {};
    let tokens = [];
    balances.assets.map((item) => {
      if (item.chain == chainId && item.external_address) {
        chain_external_address = item.external_address;
      }
      balances_json[item.symbol] = item;
    });
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
  choose = (symbol, title, address, logo) => () => {
    this.qrcode(address);
    this.setState({
      choose: {
        symbol,
        title,
        address,
        logo,
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
    const token = this.props.tokens.find((item) => item.symbol == symbol) || {
      name: "",
    };
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
          <Grid item xs={4}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>{token.name.toUpperCase()}</h2>
          </Grid>
          <Grid item xs={4} style={{ textAlign: "right" }}></Grid>
        </Grid>
        <div className={classes.form}>
          <div className={classes.chain_address_title}>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.chain_address}
            >
              <Grid item className={classes.chain_symbol}>
                <h2>{token.name.toUpperCase()}</h2>
              </Grid>
              {(!token.is_native && chain_external_address) ||
              (token.is_native && address) ? (
                <CopyToClipboard
                  text={chain_external_address || address}
                  onCopy={this.copy}
                >
                  <Grid item className="address">
                    {this.short_address(chain_external_address || address)}
                    <Iconfont
                      type="QRcode"
                      size={20}
                      onClick={this.choose(
                        symbol,
                        chain_external_address
                          ? "external chain address"
                          : "HBC chain address",
                        chain_external_address || address,
                        token.logo
                      )}
                    />
                  </Grid>
                </CopyToClipboard>
              ) : (
                <Grid
                  className="address"
                  item
                  onClick={() => {
                    this.props.dispatch(
                      routerRedux.push({
                        pathname: route_map.external_address + "/" + symbol,
                      })
                    );
                  }}
                >
                  <em>
                    {this.props.intl.formatMessage({
                      id: "create external address",
                    })}
                  </em>
                  {token.logo ? <img src={token.logo} /> : ""}
                </Grid>
              )}
            </Grid>
          </div>

          <div
            className={classnames(classes.token_list, classes.chain_token_list)}
          >
            <Grid
              container
              justify="space-between"
              className={classes.add_token}
            >
              <Grid item>Token</Grid>
              <Grid item>
                <span
                  onClick={() => {
                    this.props.dispatch(
                      routerRedux.push({
                        pathname: route_map.add_token + "/" + symbol,
                      })
                    );
                  }}
                >
                  <Iconfont type="addaccount" />
                  {this.props.intl.formatMessage({ id: "add token" })}
                </span>
              </Grid>
            </Grid>
            {this.state.tokens.map((item) => {
              if (item.hide) {
                return "";
              }
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
                        {item.name.split("")[0].toUpperCase()}
                      </Avatar>
                    )}
                  </Grid>
                  <Grid item style={{ flex: 1, margin: "0 0 0 12px" }}>
                    <strong>{item.name.toUpperCase()}</strong>
                    {item.symbol != "hbc" ? (
                      item.is_verified ? (
                        <i className={item.is_native ? "native" : ""}>
                          {this.props.intl.formatMessage({
                            id: item.is_native ? "native" : "not native",
                          })}
                        </i>
                      ) : (
                        <i className={"verified"}>
                          {this.props.intl.formatMessage({
                            id: "not verified",
                          })}
                        </i>
                      )
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
          </Grid>
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
