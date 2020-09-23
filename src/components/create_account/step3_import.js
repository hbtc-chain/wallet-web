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

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      showseed: false,
      seed: "",
      seed_msg: "",
      password: "",
      password_msg: "",
      confirmpwd: "",
      confirmpwd_msg: "",
      checked: false,
    };
  }
  showseed = () => {
    this.setState({
      showseed: !this.state.showseed,
    });
  };
  handleChange = (key) => (e) => {
    let v = e.target.value || "";
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
  submit = () => {
    const password = this.state.password;
    const confirmpwd = this.state.confirmpwd;
    const checked = this.state.checked;
    const seed = this.state.seed
      .replace(/^\s/g, "")
      .replace(/\s$/g, "")
      .replace(/\s{2,}/, "")
      .split(" ");
    if (seed.length != 12) {
      this.setState({
        seed_msg: this.props.intl.formatMessage({ id: "seed_error" }),
      });
      return;
    }
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
  };
  verif = () => {
    let r = true;
    const password = this.state.password;
    const seed = this.state.seed;
    const confirmpwd = this.state.confirmpwd;
    const checked = this.state.checked;
    if (!password || !confirmpwd || !checked || !seed) {
      return false;
    }
    return r;
  };
  goback = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_step1,
      })
    );
  };
  render() {
    const { classes } = this.props;
    const params = querystring.parse(window.location.search || "");
    return (
      <div className={classes.step3_import}>
        <span className={classes.back} onClick={this.goback}>
          {"< back"}
        </span>
        <h1>{this.props.intl.formatMessage({ id: "import.title" })}</h1>
        <p>{this.props.intl.formatMessage({ id: "import.desc" })}</p>
        <Grid container className={classes.form}>
          {this.state.showseed ? (
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                label={this.props.intl.formatMessage({ id: "import.seed" })}
                value={this.state.seed}
                onChange={this.handleChange("seed")}
                error={Boolean(this.state.seed_msg)}
                helperText={this.state.seed_msg}
                multiline
                rows={4}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <VisibilityOffIcon
                      style={{ cursor: "pointer" }}
                      onClick={this.showseed}
                    />
                  ),
                }}
              />
            </Grid>
          ) : (
            <Grid item xs={12} className={classes.item}>
              <TextField
                fullWidth
                label={this.props.intl.formatMessage({ id: "import.seed" })}
                value={this.state.seed}
                onChange={this.handleChange("seed")}
                error={Boolean(this.state.seed_msg)}
                helperText={this.state.seed_msg}
                type="password"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <VisibilityIcon
                      style={{ cursor: "pointer" }}
                      onClick={this.showseed}
                    />
                  ),
                }}
              />
            </Grid>
          )}
        </Grid>
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
              variant="outlined"
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
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container alignItems="center" className={classes.checkform2}>
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
          color="primary"
          variant="contained"
          className={classes.btn_large}
          disabled={!this.verif()}
          onClick={this.submit}
        >
          {this.props.intl.formatMessage({
            id: "import",
          })}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
