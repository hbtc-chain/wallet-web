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
      token: "",
    };
  }
  componentDidMount() {
    const account =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]
        : {};
    this.setState({
      account,
      token: this.props.match.params.token || "hbc",
    });
    this.qrcode(account.address);
  }
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
  render() {
    const { classes } = this.props;
    const account = this.state.account;
    const symbol = this.props.match.params.token.toLowerCase();
    const token = this.props.tokens.find((item) => item.symbol == symbol);
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
            <h2>
              <span>
                {this.props.intl.formatMessage({ id: "receive payment" })}
                {symbol.toUpperCase()}
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

          <Paper>
            <h2>
              {this.props.intl.formatMessage(
                { id: "{symbol} address" },
                { symbol: symbol.toUpperCase() }
              )}
            </h2>
            {account.address ? <img src={this.state[account.address]} /> : ""}
            <strong>{account.address}</strong>
            <CopyToClipboard text={account.address} onCopy={this.copy}>
              <span>
                {this.props.intl.formatMessage({ id: "copy address" })}
              </span>
            </CopyToClipboard>
            <i></i>
            <i></i>
            {token && token.logo ? (
              <img src={token.logo} className="token_logo" />
            ) : (
              ""
            )}
          </Paper>
          <dl className={classes.tip}>
            <dt>{this.props.intl.formatMessage({ id: "tip" })}</dt>
            <dd>xxxxxxxxxxxxxxxxx</dd>
            <dd>yyyyyyyyyyyyyyyyyy</dd>
          </dl>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
