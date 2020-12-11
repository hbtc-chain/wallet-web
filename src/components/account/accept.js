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
      token: this.props.match.params.token,
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
    return (
      <div className={classes.accept}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.back}
        >
          <Grid item xs={2} style={{ padding: "0 0 0 16px" }}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>
              {this.props.intl.formatMessage({ id: "receive payment" })}
              {this.state.token.toUpperCase()}
              <Iconfont type="arrowdown" />
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div
          className={classes.accept_content}
          style={{ height: "calc(100vh - 44px)" }}
        >
          <p>{this.props.intl.formatMessage({ id: "support hbc account" })}</p>
          <Paper>
            {account.address ? <img src={this.state.img} /> : ""}
            <strong>{account.address}</strong>
            <CopyToClipboard text={account.address} onCopy={this.copy}>
              <span>
                {this.props.intl.formatMessage({ id: "copy address" })}
              </span>
            </CopyToClipboard>
            <i></i>
            <i></i>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
