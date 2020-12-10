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
import classnames from "classnames";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password_msg_arr: ["pwd_rule1"],
      password_msg_i: [],
      confirmpwd: "",
      confirmpwd_msg_arr: ["pwd_rule2"],
      confirmpwd_msg_i: [],
      account: "",
      account_msg: "",
      account_msg_arr: ["set.account.rule1", "set.account.rule2"],
      account_msg_i: [],
      step1: true,
      step2: false,
    };
  }
  componentDidMount() {
    if (this.props.store.account_index > -1) {
      this.setState({
        password_msg_arr: ["pwd_rule4"],
      });
    }
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
    const account = this.state.account;
    let password = this.state.password;
    // 创建账户
    await this.props.dispatch({
      type: "layout/create_account",
      payload: {
        password,
        account,
      },
    });
    const search = this.props.location.search;
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_done,
        search,
        state: {
          password: password,
        },
      })
    );
  };
  import = async () => {
    const account = this.state.account;
    const state = this.props.location.state || {};
    let password = this.state.password;
    let obj = {
      account,
      password,
    };
    Object.assign(obj, state);
    // 创建账户
    await this.props.dispatch({
      type: "layout/create_account",
      payload: obj,
    });
    const search = this.props.location.search;
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_done,
        search,
      })
    );
  };
  verify = (key, v) => {
    const accounts = this.props.store.accounts;
    let arr1 = [],
      arr2 = [],
      accountArr = [];
    if (this.state.step1) {
      const hasAccount = accounts.filter((l) => l.username == v);
      if (v && v.length > 20) {
        accountArr.push(0);
      }
      if (v && hasAccount.length) {
        accountArr.push(1);
      }
    }
    if (this.state.step2) {
      const password = key == "password" ? v : this.state.password;
      const confirmpwd = key == "confirmpwd" ? v : this.state.confirmpwd;
      if (password && !/^\d{6}$/.test(password)) {
        arr1.push(0);
      }
      // if (password && !/^\d{6}$/.test(password)) {
      //   arr1.push(1);
      // }
      if (
        this.props.store.account_index > -1 &&
        helper.sha256(password) !== this.props.store.accounts[0]["password"]
      ) {
        arr1.push(2);
      }
      if (this.props.store.account_index == -1 && password != confirmpwd) {
        arr2.push(0);
      }
    }
    this.setState({
      password_msg_i: arr1,
      confirmpwd_msg_i: arr2,
      account_msg_i: accountArr,
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
  next = () => {
    const params = querystring.parse(this.props.location.search || "");
    // if (this.props.store.account_index > -1) {
    //   if (params.type == "create") {
    //     this.submit();
    //   } else {
    //     this.import();
    //   }
    // } else {
    this.setState({
      step1: false,
      step2: true,
    });
    // }
  };
  pre = () => {
    if (this.state.step1) {
      this.props.dispatch(routerRedux.goBack());
    } else {
      this.setState({
        step1: true,
        step2: false,
      });
    }
  };
  isDisabled = () => {
    if (this.props.store.account_index > -1) {
      return !this.state.password || this.state.password_msg_i.length;
    }
    return (
      !this.state.password ||
      !this.state.confirmpwd ||
      this.state.password_msg_i.length ||
      this.state.confirmpwd_msg_i.length
    );
  };
  render() {
    const { classes, intl, ...otherProps } = this.props;
    const params = querystring.parse(this.props.location.search || "");
    return [
      <Nav
        key="nav"
        title={intl.formatMessage({
          id: params.type == "create" ? "create account" : "import account",
        })}
        onClick={this.pre}
        {...otherProps}
      />,
      this.state.step1 ? (
        <div
          className={classnames(classes.step3, classes.set_account)}
          key="account"
        >
          <h1 className={classes.tit}>
            {intl.formatMessage({ id: "set.account.title" })}
          </h1>
          <p className={classes.desc}>
            {intl.formatMessage({ id: "set.account.desc" })}
          </p>
          <label>
            {this.props.intl.formatMessage({
              id: "account.name",
            })}
          </label>
          <Grid container className={classes.form}>
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                placeholder={intl.formatMessage({ id: "set.account.rule1" })}
                value={this.state.account}
                onChange={this.handleChange("account")}
                type="text"
                InputProps={{
                  endAdornment: this.state.account ? (
                    this.state.account_msg_i.length > 0 ? (
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
              {this.state.account && this.state.account_msg_i.length > 0 ? (
                <div className="tip">
                  {this.state.account_msg_arr.map((item, i) => {
                    return (
                      <p
                        className={
                          this.state.account_msg_i.indexOf(i) > -1
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
            color="primary"
            variant="contained"
            fullWidth
            className={classes.button}
            disabled={
              !this.state.account || this.state.account_msg_i.length
                ? true
                : false
            }
            onClick={this.next}
          >
            {intl.formatMessage({
              id: "determine",
            })}
          </Button>
        </div>
      ) : (
        ""
      ),
      this.state.step2 ? (
        <div className={classes.step3} key="content">
          <img
            className={classes.logo}
            src={require("../../assets/logo.png")}
          />
          <Grid container className={classes.form}>
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                placeholder={intl.formatMessage({
                  id:
                    this.props.store.account_index > -1
                      ? "password"
                      : "new.password",
                })}
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
            {this.props.store.account_index > -1 ? (
              ""
            ) : (
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
                {this.state.confirmpwd &&
                this.state.confirmpwd_msg_i.length > 0 ? (
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
            )}
          </Grid>
          {params.type == "create" ? (
            <Button
              onClick={this.submit}
              disabled={this.isDisabled()}
              color="primary"
              variant="contained"
              fullWidth
              className={classes.button}
            >
              {intl.formatMessage({
                id: "create",
              })}
            </Button>
          ) : (
            <Button
              onClick={this.import}
              disabled={this.isDisabled()}
              color="primary"
              variant="contained"
              fullWidth
              className={classes.button}
            >
              {intl.formatMessage({
                id: "import",
              })}
            </Button>
          )}
        </div>
      ) : (
        ""
      ),
    ];
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
