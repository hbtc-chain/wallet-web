// 创建新账号
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Grid, TextField, Checkbox } from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";
import Nav from "./nav";
import classnames from "classnames";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      seed: "",
      seed_msg: "",
      password: "",
      password_msg: "",
      confirmpwd: "",
      confirmpwd_msg: "",
      keyStore: "",
      keyStorepwd: "",
      key: "",
      // 展示信息
      seed_title: "seed.import.title",
      seed_desc: "seed.import.desc",
      keyStore_title: "keystore.import.tile",
      keyStore_desc: "keystore.import.desc1",
      key_title: "key.import.title",
      key_desc: "key.import.desc",
    };
  }
  //去重
  unique(array) {
    var res = array.filter(function (item, index, array) {
      return array.indexOf(item) === index;
    });
    return res;
  }
  handleChange = (key) => (e) => {
    let v = e.target.value || "";
    let msg = "";
    if (key == "seed") {
      const seedArr = v
        .replace(/\s{2,}/, " ")
        .replace(/^\s/g, "")
        .replace(/\s$/g, "")
        .split(" ");
      msg =
        v && (seedArr.length != 12 || this.unique(seedArr).length != 12)
          ? this.props.intl.formatMessage({ id: "seed.error" })
          : "";
    }
    if (key == "password") {
      if (v && v.length < 8) {
        msg = this.props.intl.formatMessage({ id: "pwd_rule1" });
      }
      if (v && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/.test(v)) {
        msg = this.props.intl.formatMessage({ id: "pwd_rule3" });
      }
    }
    this.setState({
      [key]: v,
      [key + "_msg"]: msg,
    });
  };
  submit = async () => {
    const params = querystring.parse(this.props.location.search || "");
    const way = params.way;
    const password = this.state.password;
    let obj = {};
    if (way == "seed") {
      const seed = this.state.seed
        .replace(/\s{2,}/, " ")
        .replace(/^\s/g, "")
        .replace(/\s$/g, "")
        .split(" ");
      if (seed.length != 12 || this.unique(seed).length != 12) {
        this.setState({
          seed_msg: this.props.intl.formatMessage({ id: "seed.error" }),
        });
        return;
      }
      if (password.length < 8) {
        this.setState({
          password_msg: this.props.intl.formatMessage({ id: "pwd_rule1" }),
        });
        return;
      }
      if (
        password &&
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/.test(password)
      ) {
        this.setState({
          password_msg: this.props.intl.formatMessage({ id: "pwd_rule3" }),
        });
        return;
      }
      obj = {
        password: this.state.password,
        mnemonic: seed.join(" "),
      };
    }
    if (way == "keyStore") {
      const keyStore = this.state.keyStore.replace(/\s/g, "");
      const keyStorepwd = this.state.keyStorepwd.replace(/\s/g, "");
      if (!keyStore || !keyStorepwd) {
        return;
      }
      obj = {};
    }
    if (way == "key") {
      const key = this.state.key.replace(/\s/g, "");
      if (!key) {
        return;
      }
      obj = {};
    }
    await this.props.dispatch({
      type: "layout/create_account",
      payload: obj,
    });
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_done,
        state: {
          password: password,
        },
      })
    );
  };
  verif = () => {
    let r = true;
    const params = querystring.parse(this.props.location.search || "");
    const way = params.way;
    if (way == "seed") {
      const seed = this.state.seed;
      const seedArr = seed
        .replace(/\s{2,}/, " ")
        .replace(/^\s/g, "")
        .replace(/\s$/g, "")
        .split(" ");
      if (!seed || seedArr.length != 12 || this.unique(seedArr).length != 12) {
        return false;
      }
      return r;
    } else if (way == "keyStore") {
      if (!this.state.keyStore || !this.state.keyStorepwd) {
        return false;
      }
      return r;
    } else if (way == "key") {
      if (!this.state.key) {
        return false;
      }
      return r;
    }
  };

  render() {
    const { classes, intl, ...otherProps } = this.props;
    const params = querystring.parse(this.props.location.search || "");
    const way = params.way;
    const search = (this.props.location.search || "").replace(
      /&way=(.*?)(&|$)/,
      ""
    );
    return [
      <Nav
        key="nav"
        title={intl.formatMessage({ id: this.state[way + "_title"] })}
        url={route_map.create_account_step3}
        search={search}
        {...otherProps}
      />,
      <div
        className={classnames(classes.step, classes.seed_import)}
        key="content"
      >
        <p>{intl.formatMessage({ id: this.state[way + "_desc"] })}</p>
        {way == "seed" ? (
          <Grid container className={classes.form}>
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                value={this.state.seed}
                className={classes.textarea}
                onChange={this.handleChange("seed")}
                error={Boolean(this.state.seed_msg)}
                helperText={this.state.seed_msg}
                placeholder={intl.formatMessage({ id: "seed" })}
                multiline
                rows={5}
                variant="outlined"
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {way == "seed" ? (
          <Grid container className={classes.form}>
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                value={this.state.password}
                className={classes.input}
                onChange={this.handleChange("password")}
                error={Boolean(this.state.password_msg)}
                helperText={this.state.password_msg}
                placeholder={intl.formatMessage({ id: "enter password" })}
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {way == "keyStore" ? (
          <Grid container className={classes.form}>
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                value={this.state.keyStore}
                className={classes.textarea}
                onChange={this.handleChange("keyStore")}
                multiline
                rows={5}
                variant="outlined"
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {way == "keyStore" ? (
          <Grid container className={classes.form}>
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                value={this.state.keyStorepwd}
                className={classes.input}
                onChange={this.handleChange("keyStorepwd")}
                placeholder={intl.formatMessage({ id: "enter password" })}
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {way == "key" ? (
          <Grid container className={classes.form}>
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                value={this.state.key}
                className={classes.textarea}
                onChange={this.handleChange("key")}
                multiline
                rows={5}
                variant="outlined"
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        <Button
          color="primary"
          variant="contained"
          className={classes.btn_large}
          disabled={!this.verif()}
          onClick={this.submit}
          fullWidth
        >
          {intl.formatMessage({
            id: "next",
          })}
        </Button>
      </div>,
    ];
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
