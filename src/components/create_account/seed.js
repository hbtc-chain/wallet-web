// 12个种子词，并进行确认
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { routerRedux } from "dva/router";
import { injectIntl } from "react-intl";
import { Button, Grid, TextField, Checkbox, Paper } from "@material-ui/core";
import route_map from "../../config/route_map";
import LockIcon from "@material-ui/icons/Lock";
import helper from "../../util/helper";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      mask: false,
      step1: true,
      step2: false,
      seed: "",
      seeds: [],
      seeds_sort: [],
      seed_confirm_msg: "",
    };
  }
  componentDidMount() {
    const password = this.props.location.state
      ? this.props.location.state.password
      : "";
    const account =
      this.props.store.accounts &&
      this.props.store.account_index > -1 &&
      this.props.store.accounts[this.props.store.account_index]
        ? this.props.store.accounts[this.props.store.account_index]
        : "";
    if (account.mnemonic && password) {
      const seed = helper.aes_decrypt(account.mnemonic, password);
      this.setState({
        seeds: seed.split(" "),
        seeds_sort: seed.split(" ").sort((a, b) => {
          const r = Math.random();
          if (r - 0.5 >= 0) {
            return -1;
          } else {
            return 1;
          }
        }),
      });
    }
  }
  showword = () => {
    this.setState({
      mask: true,
    });
  };
  next = () => {
    this.setState({
      step2: true,
      step1: false,
      mask: false,
    });
  };
  pre = () => {
    this.setState({
      mask: false,
      step1: true,
      step2: false,
      seed: "",
    });
  };
  seed_set = (key) => (e) => {
    this.setState({
      seed: (this.state.seed.indexOf(key) > -1
        ? this.state.seed.replace(key, "").replace(/\s{2,}/g, " ")
        : (this.state.seed + " " + key).replace(/\s{2,}/g, " ")
      )
        .replace(/^\s/g, "")
        .replace(/\s$/g, ""),
      seed_confirm_msg: "",
    });
  };
  seed_confirm = () => {
    if (this.state.seed == this.state.seeds.join(" ")) {
      // 创建账户
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.create_account_done,
        })
      );
    } else {
      this.setState({
        seed_confirm_msg: this.props.intl.formatMessage({
          id: "seed index wrong",
        }),
      });
    }
  };
  jump = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.index,
      })
    );
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.seed}>
        {this.state.step1 ? (
          <div>
            <h1>{this.props.intl.formatMessage({ id: "seed.title" })}</h1>
            <p>{this.props.intl.formatMessage({ id: "seed.desc1" })}</p>
            <p>{this.props.intl.formatMessage({ id: "seed.desc2" })}</p>
            <p>
              <a>{this.props.intl.formatMessage({ id: "seed.desc3" })}</a>
            </p>
            <Paper variant="outlined" className={classes.seed_word}>
              <strong className={this.state.mask ? "" : classes.blur}>
                {this.state.seeds.join(" ")}
              </strong>
              {this.state.mask ? (
                ""
              ) : (
                <div onClick={this.showword}>
                  <LockIcon />
                  {this.props.intl.formatMessage({ id: "seed.word.mask" })}
                </div>
              )}
            </Paper>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  onClick={this.jump}
                  color="primary"
                  variant="contained"
                  className={classes.btn_large}
                >
                  {this.props.intl.formatMessage({
                    id: "next time to backup",
                  })}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  disabled={!Boolean(this.state.mask)}
                  onClick={this.next}
                  color="primary"
                  variant="contained"
                  className={classes.btn_large}
                >
                  {this.props.intl.formatMessage({
                    id: "next",
                  })}
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          ""
        )}
        {this.state.step2 ? (
          <div className={classes.seed_confirm}>
            <span className={classes.back} onClick={this.pre}>
              {"< back"}
            </span>
            <h1>
              {this.props.intl.formatMessage({ id: "seed.confirm.title" })}
            </h1>
            <p>{this.props.intl.formatMessage({ id: "seed.confirm.desc" })}</p>
            <Paper variant="outlined" className={classes.seed_word}>
              <strong>{this.state.seed}</strong>
            </Paper>
            <Grid container spacing={2} className={classes.seed_options}>
              {this.state.seeds_sort.map((item) => {
                return (
                  <Grid item xs={3} key={item}>
                    <Button
                      variant={
                        this.state.seed.indexOf(item) > -1
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        this.state.seed.indexOf(item) > -1
                          ? "primary"
                          : "inherit"
                      }
                      fullWidth
                      onClick={this.seed_set(item)}
                      className={classes.btn_seed}
                    >
                      {item}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
            <Button
              color="primary"
              variant="contained"
              onClick={this.seed_confirm}
              className={classes.btn_large}
              disabled={this.state.seed.split(" ").length != 12}
            >
              {this.props.intl.formatMessage({ id: "confirm" })}
            </Button>
            <div className={classes.error_msg}>
              {this.state.seed_confirm_msg}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
