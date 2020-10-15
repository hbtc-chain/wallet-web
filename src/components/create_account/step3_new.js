// 创建新账号
import React from "react";
import { routerRedux } from "dva/router";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Grid, TextField, Checkbox } from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";
import CONST from "../../util/const";
import helper from "../../util/helper";
import Nav from "./nav";
import Cancel from "@material-ui/icons/Cancel";
import CheckCircle from "@material-ui/icons/CheckCircle";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password_msg_arr: ["pwd_rule1", "pwd_rule3"],
      password_msg_i: [],
      confirmpwd: "",
      confirmpwd_msg_arr: ["pwd_rule2"],
      confirmpwd_msg_i: [],
    };
  }
  handleChange = (key) => (e) => {
    let v = (e.target.value || "").replace(/\s/g, "");
    this.setState({
      [key]: v,
      [key + "_msg_i"]: [],
    });
    this.verify(key, v);
  };
  submit = async () => {
    const { intl } = this.props;
    const password = this.state.password;
    const confirmpwd = this.state.confirmpwd;
    // 创建账户
    await this.props.dispatch({
      type: "layout/create_account",
      payload: {
        password,
      },
    });
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.account_seed,
        search: this.props.location.search,
        state: {
          password: password,
        },
      })
    );
  };
  verify = (key, v) => {
    let arr1 = [],
      arr2 = [];
    const password = key == "password" ? v : this.state.password;
    const confirmpwd = key == "confirmpwd" ? v : this.state.confirmpwd;
    if (password && password.length < 8) {
      arr1.push(0);
    }
    if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/.test(password)) {
      arr1.push(1);
    }
    if (password != confirmpwd) {
      arr2.push(0);
    }
    this.setState({
      password_msg_i: arr1,
      confirmpwd_msg_i: arr2,
    });
  };
  verif = () => {
    let r = true;
    const password = this.state.password;
    const confirmpwd = this.state.confirmpwd;
    if (!password || !confirmpwd) {
      return false;
    }
    return r;
  };
  render() {
    const { classes, intl, ...otherProps } = this.props;
    const params = querystring.parse(window.location.search || "");
    return [
      <Nav
        key="nav"
        title={intl.formatMessage({ id: "create.step1.btn.create" })}
        url={route_map.create_account_step1}
        {...otherProps}
      />,
      <div className={classes.step3} key="content">
        <img className={classes.logo} src={require("../../assets/logo.png")} />
        <Grid container className={classes.form}>
          <Grid item xs={12} className={classes.item}>
            <TextField
              fullWidth
              placeholder={intl.formatMessage({ id: "new.password" })}
              value={this.state.password}
              onChange={this.handleChange("password")}
              type="password"
              InputLabelProps={{
                shrink: false,
              }}
              InputProps={{
                endAdornment: this.state.password ? (
                  this.state.password_msg_i.length > 0 ? (
                    <Cancel className={classes.error} />
                  ) : (
                    <CheckCircle className={classes.right} />
                  )
                ) : (
                  ""
                ),
                classes: {
                  root: classes.input_root,
                },
              }}
            />
            {this.state.password && this.state.password_msg_i.length > 0 ? (
              <div className="tip">
                {this.state.password_msg_arr.map((item, i) => {
                  return (
                    <p
                      className={
                        this.state.password_msg_i.indexOf(i) > -1
                          ? classes.error
                          : ""
                      }
                      key={i}
                    >
                      {intl.formatMessage({ id: item })}
                    </p>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <TextField
              fullWidth
              placeholder={intl.formatMessage({ id: "confirm.password" })}
              value={this.state.confirmpwd}
              onChange={this.handleChange("confirmpwd")}
              type="password"
              InputLabelProps={{
                shrink: false,
              }}
              InputProps={{
                endAdornment: this.state.confirmpwd ? (
                  this.state.confirmpwd_msg_i.length > 0 ? (
                    <Cancel className={classes.error} />
                  ) : (
                    <CheckCircle className={classes.right} />
                  )
                ) : (
                  ""
                ),
                classes: {
                  root: classes.input_root,
                },
              }}
            />
            {this.state.confirmpwd && this.state.confirmpwd_msg_i.length > 0 ? (
              <div className="tip">
                {this.state.confirmpwd_msg_arr.map((item, i) => {
                  return (
                    <p
                      className={
                        this.state.confirmpwd_msg_i.indexOf(i) > -1
                          ? classes.error
                          : ""
                      }
                      key={i}
                    >
                      {intl.formatMessage({ id: item })}
                    </p>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Button
          onClick={this.submit}
          disabled={
            !this.state.password ||
            !this.state.confirmpwd ||
            this.state.password_msg_i.length ||
            this.state.confirmpwd_msg_i.length
          }
          color="primary"
          variant="contained"
          fullWidth
          className={classes.button}
        >
          {intl.formatMessage({
            id: "create",
          })}
        </Button>
      </div>,
    ];
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
