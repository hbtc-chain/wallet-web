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
import Nav from "./nav";
import classnames from "classnames";
import Cancel from "@material-ui/icons/Cancel";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      step1: true,
      step2: false,
      seeds: [],
      seeds_sort: [],
      seeds_select: new Array(12),
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
    let seeds_select = this.state.seeds_select;
    for (var i = 0; i < seeds_select.length; i++) {
      seeds_select[i] = "";
    }
    this.setState({ seeds_select });
  }
  next = () => {
    this.setState({
      step2: true,
      step1: false,
    });
  };
  pre = () => {
    let seeds_select = this.state.seeds_select;
    for (var i = 0; i < seeds_select.length; i++) {
      seeds_select[i] = "";
    }
    this.setState({ seeds_select });
    this.setState({
      step1: true,
      step2: false,
      seeds_select,
    });
  };
  seed_set = (key) => (e) => {
    let seeds_select = this.state.seeds_select;
    const isSelect = seeds_select.indexOf(key) > -1;
    if (isSelect) {
      return;
    }
    const index = seeds_select.findIndex((v, i) => {
      return v == "";
    });
    if (index > -1) {
      seeds_select[index] = key;
      this.setState({ seeds_select });
    }
  };
  seed_delete = (i) => (e) => {
    let seeds_select = this.state.seeds_select;
    seeds_select[i] = "";
    this.setState({ seeds_select });
  };
  seed_confirm = () => {
    if (
      this.state.seeds_select.length == 12 &&
      this.state.seeds.join(" ") === this.state.seeds_select.join(" ")
    ) {
      // 创建账户
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.create_account_done,
          search: this.props.location.search,
        })
      );
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
    const { classes, intl, ...otherProps } = this.props;
    const { step1, step2, seeds, seeds_sort, seeds_select } = this.state;
    return [
      step1 ? (
        <Nav
          key="nav"
          title={intl.formatMessage({ id: "create.step1.btn.create" })}
          url={route_map.create_account_step3}
          {...otherProps}
        />
      ) : (
        ""
      ),
      step2 ? (
        <Nav
          key="nav"
          title={intl.formatMessage({ id: "seed.confirm.title" })}
          {...otherProps}
          onClick={this.pre}
        />
      ) : (
        ""
      ),
      <div className={classes.seed} key="content">
        {step1 ? (
          <div>
            <h1>{intl.formatMessage({ id: "seed.new.title" })}</h1>
            <p>{this.props.intl.formatMessage({ id: "seed.new.desc1" })}</p>
            <Grid container spacing={1}>
              {seeds.map((item, i) => {
                return (
                  <Grid item xs={4} key={i}>
                    <div className={classes.seed_item}>
                      <em>{i + 1}</em>
                      <p>{item}</p>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
            <Button
              onClick={this.next}
              fullWidth
              color="primary"
              variant="contained"
              className={classes.button}
            >
              {this.props.intl.formatMessage({
                id: "next",
              })}
            </Button>
          </div>
        ) : (
          ""
        )}
        {step2 ? (
          <div className={classes.seed_confirm}>
            <p>{this.props.intl.formatMessage({ id: "seed.confirm.desc" })}</p>
            <Grid container className={classes.seed_select}>
              {seeds_select.map((item, i) => {
                return (
                  <Grid
                    item
                    xs={4}
                    key={i}
                    className={classnames(
                      classes.seed_item,
                      classes.seed_input,
                      item && seeds[i] !== item ? "error" : ""
                    )}
                  >
                    <div>
                      <em>{i + 1}</em>
                      <p>{item || ""}</p>
                      {item ? (
                        <Cancel
                          style={{ fontSize: 14 }}
                          onClick={this.seed_delete(i)}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </Grid>
                );
              })}
            </Grid>
            <Grid container spacing={1}>
              {seeds_sort.map((item) => {
                const isSelect = seeds_select.indexOf(item) > -1;
                return (
                  <Grid item xs={4} key={item}>
                    <div
                      className={classnames(
                        classes.seed_item,
                        classes.seed_options,
                        isSelect ? "disabled" : ""
                      )}
                      onClick={this.seed_set(item)}
                    >
                      <p>{item}</p>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
            <Button
              color="primary"
              variant="contained"
              onClick={this.seed_confirm}
              fullWidth
              className={classes.button}
              disabled={
                !(
                  this.state.seeds_select.length == 12 &&
                  this.state.seeds.join(" ") ===
                    this.state.seeds_select.join(" ")
                )
              }
            >
              {this.props.intl.formatMessage({ id: "determine" })}
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>,
    ];
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
