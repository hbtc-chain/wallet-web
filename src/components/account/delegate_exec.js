// 委托
import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  Drawer,
  Avatar,
  Tabs,
  Tab,
  Paper,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import classnames from "classnames";
import util from "../../util/util";
import { Iconfont } from "../../lib";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Qrcode from "qrcode";
import CloseIcon from "@material-ui/icons/Close";
import message from "../public/message";
import API from "../../util/api";
import math from "../../util/mathjs";
import PassowrdRC from "../public/password";

class DelegateRC extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        description: {},
        commission: {},
      },
      fee: "",
      amount: "",
      amount_msg: "",
      sequence: "",
      open: false,
      msg: "",
      err_msg: "",
      memo: "",
    };
  }
  componentDidMount() {
    this.init();
    this.setFee();
  }
  componentDidUpdate() {
    if (
      this.props.tokens.length &&
      !this.state.fee &&
      this.props.default_fee.fee
    ) {
      this.setFee();
    }
  }
  handleChange = (key) => (e) => {
    this.setState({
      [key]: e.target.value,
      [key + "_msg"]: "",
      err_msg: "",
    });
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
  setFee = () => {
    const token_hbc = this.props.tokens.find((item) => item.symbol == "hbc");
    if (token_hbc && this.props.default_fee.fee) {
      this.setState({
        fee: this.decimals(this.props.default_fee.fee, -token_hbc.decimals, 1),
      });
    }
  };
  init = async () => {
    const operator_address = this.props.match.params.operator_address;
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.validators + "/" + operator_address,
    });
    if (result.code == 200 && result.data) {
      this.setState({
        data: result.data,
      });
    }
  };
  submit = async () => {
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == "hbc"
          ) || { amount: "" }
        : { amount: 0 };
    const max = Number(
      math
        .chain(math.bignumber(balance.amount || 0))
        .subtract(math.bignumber(this.state.fee || 0))
        .format({ notation: "fixed" })
        .done()
    );
    if (
      !Number(this.state.amount) ||
      /[^0-9\.]/.test(this.state.amount) ||
      Number(this.state.amount) > max ||
      Number(this.state.amount) < 0
    ) {
      this.setState({
        amount_msg: this.props.intl.formatMessage(
          { id: "amount rule" },
          {
            n: balance.amount,
          }
        ),
      });
      return;
    }
    if (Number(balance.amount) < Number(this.state.fee)) {
      this.setState({
        amount_msg: this.props.intl.formatMessage({ id: "fee not enough" }),
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
        open: true,
        msg: "",
        err_msg: "",
      });
    } else {
      message.error(
        result.data.error_message
          ? result.data.error_message.message
          : "unknown error"
      );
      return;
    }
  };
  transfer = async (res) => {
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const hbc_token = this.props.tokens.find((item) => item.symbol == "hbc");
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
      memo: this.state.memo,
      msgs: [
        {
          type: "hbtcchain/MsgDelegate",
          value: {
            delegator_address: address,
            validator_address: this.state.data.operator_address,
            amount: {
              amount: this.decimals(this.state.amount, hbc_token.decimals),
              denom: "hbc",
            },
          },
        },
      ],
      sequence: this.state.sequence,
    };
    let obj = helper.jsonSort(d);
    let privateKey = this.props.privateKey;
    let publicKey = this.props.publicKey;

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
      open: false,
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
      this.props.dispatch({
        type: "layout/save",
        payload: {
          txhash: result.data.txhash,
        },
      });
      window.localStorage.hbc_wallet_txhash = result.data.txhash;
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
            this.props.intl.formatMessage({ id: "delegate success" })
          );
          this.props.dispatch(routerRedux.goBack());
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
  render() {
    const { classes, ...otherProps } = this.props;
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == "hbc"
          ) || { amount: 0 }
        : { amount: 0 };
    return (
      <div className={classes.delegate_node_bg}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classnames(classes.back)}
        >
          <Grid item xs={2} style={{ padding: "0 0 0 10px" }}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>
              {this.props.intl.formatMessage({
                id: "delegate",
              })}
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div className={classes.form} style={{ padding: "0 16px" }}>
          <p className={classes.delegate_desc}>
            {this.props.intl.formatMessage({ id: "delegate_desc" })}
          </p>
          <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "delegate to" })}
            </Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              variant="outlined"
              placeholder={this.props.intl.formatMessage({
                id: "output address",
              })}
              disabled
              value={this.state.data.operator_address}
              classes={{
                root: classes.outline,
              }}
              fullWidth
            />
          </div>
          <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "delegate quantity" })}
            </Grid>
            <Grid item>
              {this.props.intl.formatMessage({ id: "available" })}{" "}
              {balance.amount}
              HBC
            </Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              placeholder={this.props.intl.formatMessage({
                id: "input delegate quantity",
              })}
              value={this.state.amount}
              onChange={this.handleChange("amount")}
              fullWidth
              error={Boolean(this.state.amount_msg)}
              classes={{
                root: classes.outline,
              }}
              variant="outlined"
              helperText={this.state.amount_msg}
              InputProps={{
                endAdornment: (
                  <span
                    onClick={() => {
                      this.setState({
                        amount: Math.max(
                          0,
                          Number(
                            math
                              .chain(math.bignumber(balance.amount || 0))
                              .subtract(math.bignumber(this.state.fee || 0.002))
                              .format({ notation: "fixed" })
                              .done()
                          )
                        ),
                        amount_msg: "",
                      });
                    }}
                    color="primary"
                    className={classes.btn_all}
                    style={{ whiteSpace: "nowrap", color: "#3375E0" }}
                  >
                    {this.props.intl.formatMessage({ id: "all" })}
                  </span>
                ),
              }}
            />
          </div>
          <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>{this.props.intl.formatMessage({ id: "fee" })}</Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              variant="outlined"
              placeholder={this.props.intl.formatMessage({ id: "fee" })}
              value={this.state.fee}
              //onChange={this.feeChange}
              disabled
              classes={{
                root: classes.outline,
              }}
              fullWidth
              InputProps={{
                endAdornment: <span className={classes.grey}>HBC</span>,
              }}
              error={Boolean(this.state.fee_msg)}
              helperText={this.state.fee_msg}
            />
          </div>

          <div className={classes.submit}>
            {this.state.loading || this.props.txhash ? (
              <Button color="primary" variant="contained" fullWidth disabled>
                <CircularProgress size={20} color="primary" />
              </Button>
            ) : (
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.submit}
              >
                {this.props.intl.formatMessage({ id: "delegate" })}
              </Button>
            )}
          </div>
        </div>
        <PassowrdRC
          {...otherProps}
          open={this.state.open}
          cancel={() => {
            this.setState({
              open: false,

              loading: false,
            });
          }}
          submit={this.transfer}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(DelegateRC));
