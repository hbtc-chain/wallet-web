// 映射
import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  Radio,
  CircularProgress,
  Paper,
  Divider,
  Avatar,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Qrcode from "qrcode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import message from "../public/message";
import classnames from "classnames";
import { Iconfont } from "../../lib";
import API from "../../util/api";
import PassowrdRC from "../public/password";
import util from "../../util/util";
import math from "../../util/mathjs";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      open: false,
      type: 0,
      sort: 0,
      search: "",
      open2: false,
      issue_symbol: "",
      issue_quantity: "",
      target_symbol: "",
      target_quantity: "",
      issue_token: { name: "" },
      target_token: { name: "" },
      data: [],
      memo: "",
    };
  }
  componentDidMount() {
    this.get_mapping();
  }
  change = (key, value) => (e) => {
    let decimals = this.state[key.replace("_quantity", "_token")]["decimals"];
    let v = value || e.target.value.replace(/e/g, "");
    if (Number.isNaN(Number(v))) {
      return;
    }
    let dot = v.split(".");
    if (dot[1] && dot[1].length > decimals) {
      return;
    }
    this.setState({
      target_quantity: e.target.value,
      target_quantity_msg: "",
      issue_quantity: e.target.value,
      issue_quantity_msg: "",
    });
  };
  get_mapping = async () => {
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.mapping,
    });
    if (result.code == 200 && result.data) {
      const issue_symbol = this.props.match.params.issue_symbol;
      const target_symbol = this.props.match.params.target_symbol;
      let d = {};
      result.data.items.map((item) => {
        if (
          item.issue_symbol == issue_symbol &&
          item.target_symbol == target_symbol
        ) {
          d = item;
        }
      });
      this.setState({
        ...d,
        data: result.data.items,
      });
    }
  };
  rates = (v, t) => {
    let issue_symbol = helper.rates(
      1,
      this.state.issue_symbol,
      this.props.store.unit,
      this.props.rates
    );
    let token_symbol = helper.rates(
      1,
      this.state.token_symbol,
      this.props.store.unit,
      this.props.rates
    );
    return Number(issue_symbol[0]) && Number(token_symbol[0])
      ? math.chain(token_symbol[0]).divide(issue_symbol[0]).format({
          notation: "fixed",
          decimals: this.state.token_symbol.decimals,
        })
      : "";
  };
  submit = async () => {
    if (!this.state.issue_quantity) {
      this.setState({
        issue_quantity_msg: this.props.intl.formatMessage({
          id: "swap out quantity",
        }),
      });
      return;
    }
    if (!this.state.target_quantity) {
      this.setState({
        target_quantity_msg: this.props.intl.formatMessage({
          id: "swap in quantity",
        }),
      });
      return;
    }
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balance_issue =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == this.state.issue_symbol
          ) || { amount: "" }
        : { amount: "" };
    const balance_target =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == this.state.target_symbol
          ) || { amount: "" }
        : { amount: "" };
    const balance_hbc =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == "hbc"
          ) || { amount: "" }
        : { amount: "" };

    if (Number(this.state.issue_quantity) > Number(balance_issue.amount || 0)) {
      this.setState({
        issue_quantity_msg: this.props.intl.formatMessage({
          id: "max to amount",
        }),
      });
      return;
    }
    if (
      Number(this.state.target_quantity) > Number(balance_target.amount || 0)
    ) {
      this.setState({
        target_quantity_msg: this.props.intl.formatMessage({
          id: "max to amount",
        }),
      });
      return;
    }

    if (Number(this.state.fee) > Number(balance_hbc.amount)) {
      this.setState({
        fee_msg: this.props.intl.formatMessage({ id: "fee not enough" }),
      });
      return;
    }

    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.cus + "/" + address,
    });
    if (result.code == 200) {
      this.setState({
        sequence: result.data.sequence,
        open2: true,
        msg: "",
        err_msg: "",
      });
    } else {
      this.setState({
        msg: this.props.intl.formatMessage({
          id: "create external address error",
        }),
      });
      return;
    }
  };
  decimals = (amount, decimals, t) => {
    let type = { notation: "fixed", precision: 0 };
    if (t) {
      delete type.precision;
    }
    let a = math
      .chain(math.bignumber(amount))
      .multiply(Math.pow(10, decimals))
      .format(type)
      .done();
    return a;
  };
  transfer = async (res) => {
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    let d = {
      chain_id: this.props.store.chain[this.props.store.chain_index][
        "chain_id"
      ],
      fee: {
        gas: this.props.default_fee.gas, // CONST.GAS_FEE,
        amount: [
          {
            denom: "hbc",
            amount: this.props.default_fee.fee, // this.decimals(this.state.fee, token_hbc.decimals),
          },
        ],
      },
      memo: this.state.memo || "",
      msgs: [
        {
          type: "hbtcchain/mapping/MsgMappingSwap",
          value: {
            from: address,
            issue_symbol: this.props.match.params.issue_symbol, // this.state.issue_symbol,
            coins: [
              {
                denom: this.state.issue_symbol,
                amount: this.decimals(
                  this.state.issue_quantity,
                  this.state.issue_token.decimals
                ),
              },
            ],
          },
        },
      ],
      sequence: this.state.sequence,
    };
    let obj = helper.jsonSort(d);
    let account = this.props.store.accounts[this.props.store.account_index];
    let privateKey = account.privateKey;
    let publicKey = account.publicKey;

    privateKey = helper.aes_decrypt(privateKey, res.password);
    publicKey = helper.aes_decrypt(publicKey, res.password);

    const sign = helper.sign(obj, privateKey, publicKey);

    let data = {
      memo: obj.memo,
      fee: obj.fee,
      msg: obj.msgs,
      signatures: [
        {
          signature: sign,
          pub_key: {
            type: "tendermint/PubKeySecp256k1",
            value: Buffer.from(helper.HexString2Bytes(publicKey)).toString(
              "base64"
            ),
          },
        },
      ],
    };
    this.setState({
      open2: false,
      password_msg: "",
      password: "",
      loading: true,
    });
    // data 发送到后端
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: JSON.stringify({
        tx: data,
        mode: "sync",
      }),
      url: API.txs,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    if (result.code == 200) {
      this.check(result.data.txhash);
    } else {
      message.error(
        result.data && result.data.raw_log
          ? JSON.parse(result.data.raw_log).message
          : "unknown error"
      );
      this.setState({
        loading: false,
      });
    }
  };
  check = async (txhash) => {
    try {
      const result = await this.props.dispatch({
        type: "layout/commReq",
        payload: {},
        url: API.txs + "/" + txhash,
      });
      if (result.code == 200) {
        if (result.data.success) {
          message.success(
            this.props.intl.formatMessage({
              id: "hbtcchain/mapping/MsgMappingSwap success",
            })
          );
          //this.props.dispatch(routerRedux.goBack());
        } else {
          message.error(
            result.data.error_message
              ? result.data.error_message.message
              : "unknown error"
          );
        }
        this.setState({
          loading: false,
        });
        return;
      }
    } catch (e) {}
    await util.delay(1000);
    this.check(txhash);
  };
  chageToken = () => {
    let d = { ...this.state };
    this.setState({
      issue_symbol: d.target_symbol,
      issue_quantity: "",
      issue_quantity_msg: "",
      issue_token: d.target_token,
      target_symbol: d.issue_symbol,
      target_quantity: "",
      target_quantity_msg: "",
      target_token: d.issue_token,
    });
  };
  search = (e) => {
    this.setState({
      search: e.target.value,
    });
  };
  goto = (item) => (e) => {
    this.setState({
      loading: false,
      open: false,
      type: 0,
      search: "",
      open2: false,
      issue_symbol: item.issue_symbol,
      issue_token: item.issue_token,
      issue_quantity: "",
      issue_quantity_msg: "",

      target_symbol: item.target_symbol,
      target_quantity: "",
      target_quantity_msg: "",
      target_token: item.target_token,
    });
    this.props.dispatch(
      routerRedux.push({
        pathname:
          route_map.mapping +
          "/" +
          item.issue_symbol +
          "/" +
          item.target_symbol,
      })
    );
  };

  render() {
    const { classes, ...otherProps } = this.props;
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balance_issue =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == this.state.issue_symbol
          ) || { amount: "" }
        : { amount: "" };
    const balance_target =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == this.state.target_symbol
          ) || { amount: "" }
        : { amount: "" };

    return (
      <div className={classnames(classes.accept)}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classnames(classes.back)}
        >
          <Grid item xs={2} style={{ padding: "0 0 0 16px" }}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>
              <span>
                {this.props.intl.formatMessage({
                  id: "hbtcchain/mapping/MsgMappingSwap",
                })}
              </span>
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Paper className={classes.swap}>
          <Grid
            container
            className="amount"
            alignItems="center"
            justify="space-between"
          >
            <Grid item>{this.props.intl.formatMessage({ id: "pay" })}</Grid>
            <Grid item>
              {this.props.intl.formatMessage({ id: "amount" })}
              <span>{balance_issue.amount || "--"}</span>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            {this.state.issue_token.name ? (
              <Grid
                item
                onClick={() => {
                  this.setState({ open: true, type: 0 });
                }}
                className="symbol"
              >
                <img src={this.state.issue_token.logo} />
                <span>
                  {(this.state.issue_token.name || "").toUpperCase()}
                  <Iconfont type="arrowdown" size={16} />
                </span>
              </Grid>
            ) : (
              ""
            )}
            <Grid item className="input">
              <TextField
                variant="outlined"
                placeholder={this.props.intl.formatMessage({
                  id: "swap out quantity",
                })}
                fullWidth
                value={this.state.issue_quantity}
                onChange={this.change("issue_quantity")}
                error={Boolean(this.state.issue_quantity_msg)}
                helperText={this.state.issue_quantity_msg}
                InputProps={{
                  endAdornment: (
                    <em
                      onClick={this.change(
                        "issue_quantity",
                        balance_issue.amount || "0"
                      )}
                    >
                      {this.props.intl.formatMessage({ id: "all" })}
                    </em>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <div className="exchange" onClick={this.chageToken}>
            <img src={require("../../assets/exchange_to.png")} />
          </div>
          <Grid
            container
            className="amount"
            alignItems="center"
            justify="space-between"
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "exchange to" })}
            </Grid>
            <Grid item>
              {this.props.intl.formatMessage({ id: "amount" })}
              {balance_target.amount || "--"}
            </Grid>
          </Grid>

          <Grid container justify="space-between">
            {this.state.target_token.name ? (
              <Grid
                item
                // onClick={() => {
                //   this.setState({ open: true, type: 1 });
                // }}
                className="symbol"
              >
                <img src={this.state.target_token.logo} />
                <span>
                  {(this.state.target_token.name || "").toUpperCase()}
                </span>
              </Grid>
            ) : (
              ""
            )}
            <Grid item className="input">
              <TextField
                variant="outlined"
                placeholder={this.props.intl.formatMessage({
                  id: "swap in quantity",
                })}
                fullWidth
                value={this.state.target_quantity}
                onChange={this.change("target_quantity")}
                error={Boolean(this.state.target_quantity_msg)}
                helperText={this.state.target_quantity_msg}
                InputProps={{
                  endAdornment: (
                    <em
                      onClick={this.change(
                        "target_quantity",
                        balance_target.amount || "0"
                      )}
                    >
                      {this.props.intl.formatMessage({ id: "all" })}
                    </em>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <div className="btn">
            {this.state.loading ? (
              <Button color="primary" variant="contained" fullWidth disabled>
                <CircularProgress size={20} />
              </Button>
            ) : (
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.submit}
              >
                {this.props.intl.formatMessage({
                  id: "hbtcchain/openswap/MsgSwapExactIn",
                })}
              </Button>
            )}
          </div>
          <p className={classes.fee_msg}>{this.state.fee_msg}</p>

          <div className={classes.swap_rate}>
            <span>
              {this.props.intl.formatMessage({ id: "exchange rate" })}
            </span>
            <p>
              1{(this.state.issue_token.name || "").toUpperCase()} = 1
              {(this.state.target_token.name || "").toUpperCase()}
            </p>
            <i>
              <i></i>
            </i>
          </div>
        </Paper>

        <Paper
          className={classnames(
            classes.dialog_token,
            this.state.open ? classes.dialog_token_open : ""
          )}
        >
          <div className={classes.dialog_token_title}>
            <em>{this.props.intl.formatMessage({ id: "choose token" })}</em>
            <Iconfont
              type="close"
              onClick={() => {
                this.setState({ open: false, search: "" });
              }}
            />
          </div>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: <Iconfont type="search" />,
            }}
            placeholder={this.props.intl.formatMessage({ id: "search token" })}
            value={this.state.search}
            onChange={this.search}
            className={classes.dialog_token_search}
          />
          <div className={classes.dialog_token_list_title}>
            <span>{this.props.intl.formatMessage({ id: "tokenname" })}</span>
            {this.state.sort == 0 ? (
              <Iconfont
                type="sort-top"
                size={28}
                onClick={() => {
                  this.setState({ sort: 1 });
                }}
              />
            ) : (
              <Iconfont
                type="sort-bottom"
                size={28}
                onClick={() => {
                  this.setState({ sort: 0 });
                }}
              />
            )}
          </div>
          <div className={classes.token_list}>
            {this.state.data
              // .filter((item) => {
              //   if (
              //     this.state.type == 1 &&
              //     item.issue_symbol == this.state.issue_symbol
              //   ) {
              //     return item;
              //   }
              //   if (
              //     this.state.type == 0 &&
              //     item.target_symbol == this.state.target_symbol
              //   ) {
              //     return item;
              //   }
              //   return null;
              // })
              .sort((a, b) => {
                let a_name =
                  this.state.type == 0
                    ? a.issue_token.name
                    : a.target_token.name;
                let b_name =
                  this.state.type == 0
                    ? b.issue_token.name
                    : b.target_token.name;
                return this.state.sort == 0
                  ? a_name.toUpperCase() >= b_name.toUpperCase()
                    ? 1
                    : -1
                  : a_name.toUpperCase() >= b_name.toUpperCase()
                  ? -1
                  : 1;
              })
              .map((item) => {
                if (
                  (this.state.search &&
                    this.state.type == 0 &&
                    item.issue_symbol.indexOf(this.state.search) == -1 &&
                    item.issue_token.name.indexOf(this.state.search) == -1) ||
                  (this.state.search &&
                    this.state.type == 1 &&
                    item.target_symbol.indexOf(this.state.search) == -1 &&
                    item.target_token.name.indexOf(this.state.search) == -1)
                ) {
                  return "";
                }
                const balance = this.props.balance[
                  this.state.type == 0 ? item.issue_symbol : item.target_symbol
                ];
                return (
                  <Grid
                    container
                    key={item.symbol}
                    alignItems="center"
                    justify="space-between"
                    className={classes.token_item}
                  >
                    <Grid item>
                      {item[
                        this.state.type == 0 ? "issue_token" : "target_token"
                      ].logo ? (
                        <img
                          src={
                            item[
                              this.state.type == 0
                                ? "issue_token"
                                : "target_token"
                            ].logo
                          }
                        />
                      ) : (
                        <Avatar className={classes.avatar}>
                          {item[
                            this.state.type == 0
                              ? "issue_token"
                              : "target_token"
                          ].name
                            .split("")[0]
                            .toUpperCase()}
                        </Avatar>
                      )}
                    </Grid>
                    <Grid item style={{ flex: 1, margin: "0 0 0 12px" }}>
                      <strong>
                        {item[
                          this.state.type == 0 ? "issue_token" : "target_token"
                        ].name.toUpperCase()}
                      </strong>
                      <p>
                        {this.props.intl.formatMessage({ id: "amount" })}:
                        {balance ? balance.amount : ""}
                      </p>
                    </Grid>
                    <Grid item style={{ textAlign: "right" }}>
                      <Radio
                        onClick={this.goto(item)}
                        color="primary"
                        checked={
                          item.issue_symbol == this.state.issue_symbol &&
                          item.token_symbol == this.state.token_symbol
                        }
                      />
                    </Grid>
                  </Grid>
                );
              })}
          </div>
        </Paper>
        <PassowrdRC
          {...otherProps}
          open={this.state.open2}
          cancel={() => {
            this.setState({
              open2: false,
              loading: false,
            });
          }}
          submit={this.transfer}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
