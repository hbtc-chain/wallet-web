// 接收
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
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Qrcode from "qrcode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import message from "../public/message";
import { Iconfont } from "../../lib";
import classnames from "classnames";

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
      token: "hbc",
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
      img: img,
    });
  };
  copy = () => {
    message.success(this.props.intl.formatMessage({ id: "copyed" }));
  };
  render() {
    const { classes } = this.props;
    const account =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]
        : {};
    const token = this.props.tokens.find(
      (item) => item.symbol.toLowerCase() == "hbc"
    );
    return (
      <div className={classnames(classes.accept, classes.bg_primary)}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classnames(classes.back, classes.back2)}
        >
          <Grid item xs={2} style={{ padding: "0 0 0 16px" }}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>{this.props.intl.formatMessage({ id: "receive payment" })}</h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div
          className={classes.accept_content}
          style={{ height: "calc(100vh - 44px)" }}
        >
          <Paper className="paper">
            <p>{this.props.intl.formatMessage({ id: "HBC chain address" })}</p>
            {account.address ? <img src={this.state.img} /> : ""}
            <p className="qrcode_desc">
              {this.props.intl.formatMessage({ id: "scan qrcode to pay" })}
            </p>
            <strong>{account.address}</strong>

            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.accept_btn}
            >
              <Grid item>
                <a
                  download="invite_poster.png"
                  href={(this.state.img || "").replace(
                    "image/png",
                    "image/octet-stream"
                  )}
                >
                  {this.props.intl.formatMessage({ id: "download qrcode" })}
                </a>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item>
                <CopyToClipboard text={account.address} onCopy={this.copy}>
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
          </Paper>
          <p className={classes.accept_tip}>
            {this.props.intl.formatMessage({ id: "tip" })}:<br />
            {this.props.intl.formatMessage({ id: "hbc accept tip" })}
          </p>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
