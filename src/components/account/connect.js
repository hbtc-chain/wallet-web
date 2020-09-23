// 登录
import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Grid, TextField, Checkbox } from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import CONST from "../../util/const";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: {},
      url: "",
      data: {},
      id: "",
    };
  }
  componentDidMount() {
    const state = this.props.location.state || { tab: {}, origin: "" };
    console.log(state);
    const url = state.data && state.data.origin ? state.data.origin : "";
    if (!url) {
      this.reject("The url parameter is incorrect");
      return;
    }
    this.setState({
      tab: state.data && state.data.tab ? state.data.tab : {},
      url,
      data: state.data,
      id: state.id,
    });
  }
  url_format = (url) => {
    if (!url) {
      return "";
    }
    let u = querystring.parseUrl(url);
    return u.url;
  };
  confirm = async () => {
    const sites = [...(this.props.store.sites || [])];
    const index = sites.findIndex((item) => item.indexOf(this.state.url) > -1);
    if (index == -1 && this.state.url) {
      sites.push(this.state.url);
    }
    console.log(sites, this.state.url, index);
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          sites,
        },
      },
    });
    // 发送到网页
    const msg = {
      id: this.state.id,
      type: CONST.MEHTOD_CONNECT,
      data: {
        code: 200,
        msg: "OK",
      },
    };
    if (this.props.messageManager) {
      await this.props.messageManager.sendMessage(msg);
    }
    window.close();
  };
  reject = async (reson) => {
    // 发送到网页
    const msg = {
      id: this.state.id,
      type: CONST.MEHTOD_CONNECT,
      data: {
        code: 400,
        msg: reson,
      },
    };
    if (this.props.messageManager) {
      await this.props.messageManager.sendMessage(msg);
    }
    window.close();
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.connect}>
        {this.state.tab.favIconUrl ? (
          <img src={this.state.tab.favIconUrl} />
        ) : (
          ""
        )}
        <p>{this.state.url}</p>
        <h1>{this.props.intl.formatMessage({ id: "request for access" })}</h1>
        <p>{this.props.intl.formatMessage({ id: "requset for address" })}</p>
        <Grid container justify="space-around" className={classes.connect_btns}>
          <Grid item xs={5}>
            <Button
              variant="contained"
              fullWidth
              className={classes.btn_large}
              onClick={this.reject.bind(this, "User rejected")}
            >
              {this.props.intl.formatMessage({
                id: "reject",
              })}
            </Button>
          </Grid>
          <Grid item xs={5}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              className={classes.btn_large}
              onClick={this.confirm}
            >
              {this.props.intl.formatMessage({
                id: "confirm",
              })}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
