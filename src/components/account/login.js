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
      password: "",
      password_msg: "",
    };
  }
  componentDidMount() {
    this.init();
  }
  init = () => {
    const w = window.document.documentElement.offsetWidth;
    if (!this.props.store.accounts.length) {
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.welcome,
        })
      );
    }
  };
  handleChange = (e) => {
    const v = e.target.value;
    this.setState({
      password: v,
      password_msg: "",
    });
  };
  login = async () => {
    if (!this.state.password) {
      this.setState({
        password_msg: this.props.intl.formatMessage({ id: "password request" }),
      });
      return;
    }
    const pwd = helper.sha256(this.state.password);
    const index = this.props.store.accounts.findIndex(
      (item) => item.password == pwd
    );
    if (index == -1) {
      this.setState({
        password_msg: this.props.intl.formatMessage({ id: "password failed" }),
      });
      return;
    }
    if (this.props.messageManager) {
      await this.props.messageManager.sendMessage({
        type: CONST.METHOD_LOGIN,
        data: {
          password: pwd,
        },
      });
    }
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          account_index: index,
        },
      },
    });
    const params = querystring.parse(this.props.location.search);
    if (this.props.location.pathname.indexOf(route_map.login) > -1) {
      await this.props.dispatch(
        routerRedux.push({
          pathname: route_map.index,
        })
      );
    } else {
      if (params.redirect) {
        this.props.dispatch(
          routerRedux.push({
            pathname: decodeURIComponent(params.redirect),
          })
        );
      }
    }
  };
  goto = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_step3,
        search: "type=import",
      })
    );
  };
  render() {
    const { classes, intl } = this.props;
    return (
      <div className={classes.login}>
        <img src={require("../../assets/logo.png")} />
        <h1>{intl.formatMessage({ id: "hbtc.wallet" })}</h1>
        <h1>{intl.formatMessage({ id: "login.title" })}</h1>
        <Grid container className={classes.login_form}>
          <Grid item xs={12} style={{ height: 80 }}>
            <TextField
              placeholder={this.props.intl.formatMessage({ id: "password" })}
              value={this.state.password}
              onChange={this.handleChange}
              error={Boolean(this.state.password_msg)}
              helperText={this.state.password_msg}
              type="password"
              fullWidth
              InputLabelProps={{
                shrink: false,
              }}
              InputProps={{
                classes: {
                  root: classes.input_root,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              className={classes.button}
              disabled={!Boolean(this.state.password)}
              onClick={this.login}
            >
              {this.props.intl.formatMessage({
                id: "continue",
              })}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
