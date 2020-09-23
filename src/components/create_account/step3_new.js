// 创建新账号
import React from "react";
import { routerRedux } from "dva/router";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Grid, TextField, Checkbox } from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password_msg: "",
      confirmpwd: "",
      confirmpwd_msg: "",
      checked: false,
    };
  }
  handleChange = (key) => (e) => {
    let v = (e.target.value || "").replace(/\s/g, "");
    this.setState({
      [key]: v,
      [key + "_msg"]: "",
    });
  };
  checkChange = (e) => {
    this.setState({
      checked: !this.state.checked,
    });
  };
  submit = async () => {
    const password = this.state.password;
    const confirmpwd = this.state.confirmpwd;
    const checked = this.state.checked;
    if (password.length < 8) {
      this.setState({
        password_msg: this.props.intl.formatMessage({ id: "pwd_rule1" }),
      });
      return;
    }
    if (password != confirmpwd) {
      this.setState({
        confirmpwd_msg: this.props.intl.formatMessage({ id: "pwd_rule2" }),
      });
      return;
    }
    // 创建账户
    await this.props.dispatch({
      type: "layout/create_account",
      payload: {
        password: password,
      },
    });
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.account_seed,
        state: {
          password: password,
        },
      })
    );
  };
  verif = () => {
    let r = true;
    const password = this.state.password;
    const confirmpwd = this.state.confirmpwd;
    const checked = this.state.checked;
    if (!password || !confirmpwd || !checked) {
      return false;
    }
    return r;
  };
  render() {
    const { classes } = this.props;
    const params = querystring.parse(window.location.search || "");
    return (
      <div className={classes.step3}>
        <h1>
          {this.props.intl.formatMessage({ id: "create.step1.btn.create" })}
        </h1>
        <Grid container className={classes.form}>
          <Grid item xs={12} className={classes.item}>
            <TextField
              fullWidth
              label={this.props.intl.formatMessage({ id: "new.password" })}
              value={this.state.password}
              onChange={this.handleChange("password")}
              error={Boolean(this.state.password_msg)}
              helperText={this.state.password_msg}
              type="password"
            />
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <TextField
              fullWidth
              label={this.props.intl.formatMessage({ id: "confirm.password" })}
              value={this.state.confirmpwd}
              onChange={this.handleChange("confirmpwd")}
              error={Boolean(this.state.confirmpwd_msg)}
              helperText={this.state.confirmpwd_msg}
              type="password"
            />
          </Grid>
        </Grid>
        <Grid container alignItems="center" className={classes.checkform}>
          <Grid item>
            <Checkbox
              color="primary"
              className={classes.Checkbox}
              checked={Boolean(this.state.checked)}
              onChange={this.checkChange}
            />
          </Grid>
          <Grid item xs={6}>
            <span>
              {this.props.intl.formatMessage({ id: "read and agree" })}
            </span>
            <a href="https://www.hbtc.com" target="_blank">
              {this.props.intl.formatMessage({ id: "terms" })}
            </a>
          </Grid>
        </Grid>
        <Button
          onClick={this.submit}
          disabled={!this.verif()}
          color="primary"
          variant="contained"
          className={classes.btn_large}
        >
          {this.props.intl.formatMessage({
            id: "create",
          })}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
