// 添加资产
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  Paper,
  Avatar,
  Drawer,
  Switch,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { v4 } from "uuid";
import util from "../../util/util";
import message from "../public/message";
import { Iconfont } from "../../lib";
import API from "../../util/api";
import CloseIcon from "@material-ui/icons/Close";

let timer = null;
class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      tokens: [],
      v: "",
      open: false,
    };
  }
  componentDidMount() {
    this.initToken();
  }
  componentDidUpdate() {
    if (
      this.state.tokens.length == 0 &&
      this.props.verified_tokens.length &&
      !this.state.v
    ) {
      this.initToken();
    }
  }
  initToken = () => {
    let not_in_default_token = [];
    this.props.tokens.map((item) => {
      const index = this.props.default_tokens.findIndex(
        (it) => it.symbol == item.symbol
      );
      if (index == -1) {
        const i = this.props.verified_tokens.findIndex(
          (it) => it.symbol == item.symbol
        );
        if (i == -1) {
          not_in_default_token.push(item);
        }
      }
    });
    this.setState({
      tokens: window.localStorage.hbc_wallet_tokens
        ? JSON.parse(window.localStorage.hbc_wallet_tokens)
        : this.props.verified_tokens.concat(not_in_default_token),
    });
  };

  handleChange = (symbol, token, i) => (e) => {
    const index = this.props.tokens.findIndex((item) => item.symbol == symbol);
    const default_index = this.props.verified_tokens.findIndex(
      (item) => item.symbol == symbol
    );
    let tokens = [...this.props.tokens];
    let tokens_state = [...this.state.tokens];

    if (index > -1) {
      if (default_index > -1) {
        tokens[index] = {
          ...tokens[index],
          hide: !Boolean(e.target.checked),
        };
      } else {
        tokens.splice(index, 1);
      }
    } else {
      token.hide = false;
      tokens.push(token);
    }
    tokens_state[i] = {
      ...tokens_state[i],
      hide: !Boolean(e.target.checked),
    };
    this.props.dispatch({
      type: "layout/save",
      payload: {
        tokens,
      },
    });
    this.setState({
      tokens: tokens_state,
    });
  };
  searchChange = (e) => {
    let v = e.target.value;
    v = v.replace(/\s/g, "");
    this.setState(
      {
        v,
      },
      () => {
        clearTimeout(timer);
        timer = setTimeout(this.searchToken, 1000);
      }
    );
  };
  searchToken = async () => {
    if (this.state.v) {
      const result = await this.props.dispatch({
        type: "layout/commReq",
        payload: {
          token: this.state.v,
          chain: this.props.match.params.chainId,
        },
        url: API.search_tokens,
      });
      if (result.code == 200 && result.data) {
        let res_data = [];
        result.data.map((item) => {
          const index = this.props.tokens.findIndex(
            (it) => it.symbol == item.symbol
          );
          if (index == -1) {
            res_data.push({ ...item, hide: true });
          } else {
            res_data.push({ ...item, hide: false });
          }
        });
        this.setState({
          tokens: res_data,
        });
      }
    }
  };
  render() {
    const { classes } = this.props;
    const chain = this.props.match.params.chainId;
    return (
      <div className={classes.chain}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.back}
        >
          <Grid item xs={4}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>{this.props.intl.formatMessage({ id: "add token" })}</h2>
          </Grid>
          <Grid item xs={4} style={{ textAlign: "right" }}></Grid>
        </Grid>
        <div className={classes.form}>
          <TextField
            fullWidth
            value={this.state.v}
            onChange={this.searchChange}
            placeholder={this.props.intl.formatMessage({
              id: "search token name",
            })}
            variant="outlined"
            classes={{
              root: classes.search_input,
            }}
            InputProps={{
              startAdornment: <Iconfont type="search" />,
              endAdornment: this.state.v ? (
                <CloseIcon
                  style={{ fontSize: 14 }}
                  onClick={() => {
                    this.setState({ v: "", tokens: this.props.tokens });
                  }}
                />
              ) : (
                ""
              ),
            }}
          />
          <div className={classes.token_list}>
            {this.state.tokens.length == 0 && this.state.v ? (
              <Grid
                container
                alignItems="center"
                justify="center"
                className={classes.nodata}
              >
                <Grid item>
                  <img src={require("../../assets/nodata.png")} />
                  <p>{this.props.intl.formatMessage({ id: "nodata" })}</p>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            {this.state.tokens
              .sort((a, b) =>
                a.symbol.toUpperCase() > b.symbol.toUpperCase() ? 1 : -1
              )
              .map((item, i) => {
                if (item.chain != chain) {
                  return "";
                }
                return (
                  <Grid
                    container
                    key={item.symbol}
                    alignItems="center"
                    justify="space-between"
                    className={classes.token_item}
                  >
                    <Grid item>
                      {item.logo ? (
                        <img src={item.logo} />
                      ) : (
                        <Avatar className={classes.avatar}>
                          {item.name.split("")[0].toUpperCase()}
                        </Avatar>
                      )}
                    </Grid>
                    <Grid item style={{ flex: 1, margin: "0 0 0 12px" }}>
                      <strong>{item.name.toUpperCase()}</strong>
                      <br />
                      <p>
                        {(util.short_address(item.symbol) || "").toUpperCase()}
                      </p>
                    </Grid>
                    <Grid item style={{ textAlign: "right" }}>
                      <Switch
                        checked={!(item.hide === true)}
                        onChange={this.handleChange(item.symbol, item, i)}
                        color="primary"
                        name="checkedB"
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </Grid>
                  </Grid>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
