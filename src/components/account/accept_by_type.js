// 按类型 接收
import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  CircularProgress,
  Paper,
  Divider,
  Avatar,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Qrcode from "qrcode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import message from "../public/message";
import classnames from "classnames";
import { Iconfont } from "../../lib";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      account: {},
      token_info: {},
      token: "",
      choose: 1, // 0 :hbc链地址， 1: 跨链托管地址
      sort: 0,
      search: "",
      open: false,
    };
  }
  componentDidMount() {
    this.get_data(this.props.match.params.token);
  }
  get_data = (token) => {
    const account =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]
        : {};
    const token_info = this.props.tokens.find((item) => item.symbol == token);
    const chain = token_info.chain;

    let chain_external_address = "";
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balances =
      this.props.balance && address && this.props.balance[address]
        ? this.props.balance[address] || { assets: [] }
        : { assets: [] };
    balances.assets.map((item) => {
      if (item.chain == chain && item.external_address) {
        chain_external_address = item.external_address;
      }
    });
    this.setState({
      account,
      token,
      token_info,
      chain,
      deposit_threshold: token_info.deposit_threshold,
      address: account.address,
      chain_external_address,
      choose: chain_external_address ? 1 : 0,
    });
    this.qrcode(account.address);
    this.qrcode(chain_external_address);
  };
  qrcode = async (str) => {
    if (!str) {
      return "";
    }
    if (this.state[str]) {
      return this.state[str];
    }
    const img = await Qrcode.toDataURL(str, { width: 480 });
    this.setState({
      [str]: img,
    });
  };
  copy = () => {
    message.success(this.props.intl.formatMessage({ id: "copyed" }));
  };
  changeChain = () => {
    console.log(this.state.choose);
    this.setState({
      choose: 1 - this.state.choose,
    });
  };
  rates = (v, t) => {
    return helper.rates(v, t, this.props.store.unit, this.props.rates);
  };
  goto = (symbol) => async () => {
    await this.props.dispatch(
      routerRedux.replace(route_map.accept_by_type + "/" + symbol)
      // routerRedux.push({
      //   pathname: route_map.accept_by_type + "/" + symbol,
      // })
    );
    await this.setState({
      open: false,
    });
    this.get_data(symbol);
  };
  filterStr = (str) => {
    if (!str || str.length < 26) {
      return str;
    }
    return (
      str.slice(0, 11) + "****" + str.slice(str.length - 12, str.length - 1)
    );
  };
  search = (e) => {
    this.setState({
      search: e.target.value.replace(/\s/g, ""),
    });
  };
  render() {
    const { classes } = this.props;
    const account = this.state.account;
    const symbol = this.props.match.params.token.toLowerCase();
    const token = this.props.tokens.find(
      (item) => item.symbol.toLowerCase() == symbol
    );
    const hbc = this.props.tokens.find((item) => item.symbol == "hbc");
    const type = token && token.chain == "hbc" ? token.chain : "";

    return (
      <div
        className={classnames(
          classes.accept,
          classes["accept_by_type_" + type]
        )}
      >
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classnames(classes.back, classes.back2)}
        >
          <Grid item xs={2} style={{ padding: "0 0 0 10px" }}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2
              onClick={() => {
                this.setState({ open: true });
              }}
            >
              <span>
                {this.props.intl.formatMessage({ id: "receive payment" })}
                {(this.state.token_info.name || "").toUpperCase()}
              </span>
              <Iconfont type="arrowdown" />
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div
          className={classnames(
            classes.accept_content,
            classes.accept_content_type
          )}
        >
          {type !== "hbc" ? (
            <h3>{this.props.intl.formatMessage({ id: "support hbc fee" })}</h3>
          ) : (
            ""
          )}

          <Paper className="paper">
            <h2>
              {type == ""
                ? this.state.chain_external_address
                  ? ""
                  : this.props.intl.formatMessage({
                      id: "hbc address",
                    })
                : this.props.intl.formatMessage({
                    id: "hbc address",
                  })}
              {/* {this.props.intl.formatMessage(
                { id: "{symbol} address" },
                { symbol: symbol.toUpperCase() }
              )} */}
            </h2>
            {account.address && this.state.choose == 0 ? (
              <img src={this.state[this.state.address]} />
            ) : (
              ""
            )}
            {this.state.chain_external_address && this.state.choose == 1 ? (
              <img src={this.state[this.state.chain_external_address]} />
            ) : (
              ""
            )}
            <div style={{ padding: "0 16px" }}>
              <Grid container justify="space-between">
                <Grid item>
                  {this.props.intl.formatMessage(
                    { id: "{token} receive payment address" },
                    { token: (this.state.token_info.name || "").toUpperCase() }
                  )}
                </Grid>
                <Grid item>
                  {type == "" ? (
                    this.state.chain_external_address ? (
                      <em onClick={this.changeChain}>
                        {this.props.intl.formatMessage({
                          id:
                            this.state.choose == 0
                              ? "change to external address"
                              : "change to hbc address",
                        })}
                        <Iconfont type="arrowright" />
                      </em>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              <strong>
                {this.state.choose == 0
                  ? this.state.address
                  : this.state.chain_external_address}
              </strong>
            </div>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.accept_btn}
            >
              <Grid item>
                <a
                  download="invite_poster.png"
                  href={(
                    (this.state.choose == 0
                      ? this.state[this.state.address]
                      : this.state[this.state.chain_external_address]) || ""
                  ).replace("image/png", "image/octet-stream")}
                >
                  {this.props.intl.formatMessage({ id: "download qrcode" })}
                </a>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item>
                <CopyToClipboard
                  text={
                    this.state.choose == 0
                      ? this.state.address
                      : this.state.chain_external_address
                  }
                  onCopy={this.copy}
                >
                  <span>
                    {this.props.intl.formatMessage({ id: "copy address" })}
                  </span>
                </CopyToClipboard>
              </Grid>
            </Grid>

            {token && token.logo ? (
              <img src={token.logo} className="token_logo" />
            ) : (
              ""
            )}
            {token && token.logo ? (
              this.state.choose == 0 && type == "" ? (
                <img src={hbc.logo} className="token_logo_small" />
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </Paper>
          <div className={classes.tip}>
            <p>
              {this.props.intl.formatMessage(
                {
                  id: "min deposit {token}{value}",
                },
                {
                  token: this.state.token.toUpperCase(),
                  value: this.state.deposit_threshold,
                }
              )}
            </p>
            <img
              src={require("../../assets/logo_white.png")}
              style={{ width: 132 }}
            />
          </div>
        </div>
        <Paper
          className={classnames(
            classes.dialog_token,
            this.state.open ? classes.dialog_token_open : ""
          )}
        >
          <div className={classes.dialog_token_title}>
            <em>{this.props.intl.formatMessage({ id: "choose token" })}</em>
            <Iconfont
              type="close"
              onClick={() => {
                this.setState({ open: false });
              }}
            />
          </div>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: <Iconfont type="search" />,
            }}
            placeholder={this.props.intl.formatMessage({ id: "search token" })}
            value={this.state.search}
            onChange={this.search}
            className={classes.dialog_token_search}
          />
          <div className={classes.dialog_token_list_title}>
            <span>{this.props.intl.formatMessage({ id: "tokenname" })}</span>
            {this.state.sort == 0 ? (
              <Iconfont
                type="sort-top"
                size={28}
                onClick={() => {
                  this.setState({ sort: 1 });
                }}
              />
            ) : (
              <Iconfont
                type="sort-bottom"
                size={28}
                onClick={() => {
                  this.setState({ sort: 0 });
                }}
              />
            )}
          </div>
          <div className={classes.token_list}>
            {this.props.tokens
              .sort((a, b) => {
                return this.state.sort == 0
                  ? a.name.toUpperCase() >= b.name.toUpperCase()
                    ? 1
                    : -1
                  : a.name.toUpperCase() >= b.name.toUpperCase()
                  ? -1
                  : 1;
              })
              .map((item) => {
                if (item.hide) {
                  return "";
                }
                if (
                  this.state.search &&
                  item.name.indexOf(this.state.search) == -1 &&
                  item.symbol.indexOf(this.state.search) == -1
                ) {
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
                      <p>{this.filterStr(item.symbol)}</p>
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
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
