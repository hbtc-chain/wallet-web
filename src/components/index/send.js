// 转账
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
  Slider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Select,
  MenuItem,
  OutlinedInput,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { v4 } from "uuid";
import util from "../../util/util";
import API from "../../util/api";
import math from "../../util/mathjs";
import message from "../public/message";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PasswordRC from "../public/password";

class IndexRC extends React.Component {
  constructor(props) {
    super();
    this.state = {
      symbol: "hbc",
      loading: false,
      open: false,
      password: "",
      password_msg: "",
      to_address: "",
      to_address_msg: "",
      amount: "",
      amount_msg: "",
      fee: "",
      fee_msg: "",
      mark: "",
      mark_msg: "",
      sequence: "",
      memo: "",
      err_msg: "",
    };
  }
  componentDidMount() {
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
  setFee = () => {
    const token_hbc = this.props.tokens.find((item) => item.symbol == "hbc");
    if (token_hbc && this.props.default_fee.fee) {
      this.setState({
        fee: this.decimals(this.props.default_fee.fee, -token_hbc.decimals, 1),
      });
    }
  };

  handleChange = (key) => (e) => {
    this.setState({
      [key]: e.target.value,
      [key + "_msg"]: "",
      err_msg: "",
    });
  };
  rates = (v, t) => {
    if (this.props.tokens[this.state.i]) {
      const d = helper.rates(v, t, this.props.store.unit, this.props.rates);
      return d;
    }
    return ["", this.props.store.unit];
  };
  feeChange = (e) => {
    let v = e.target.value;
    // 非数字
    if (Number.isNaN(Number(v))) {
      return;
    }
    if (Number(v) > 1) {
      v = 1;
    }
    v = util.fix_digits(v, 3);
    this.setState({
      fee: v,
      fee_msg: "",
      err_msg: "",
    });
  };
  sliderChange = (e, v) => {
    this.setState({
      fee: v,
      fee_msg: "",
      err_msg: "",
    });
  };
  submit = async () => {
    const symbol = this.state.symbol;
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == symbol
          ) || { amount: 0 }
        : { amount: 0 };
    if (!this.state.to_address) {
      this.setState({
        to_address_msg: this.props.intl.formatMessage({ id: "input address" }),
      });
      return;
    }
    if (
      !Number(this.state.amount) ||
      /[^0-9\.]/.test(this.state.amount) ||
      Number(this.state.amount) > balance.amount
    ) {
      this.setState({
        amount_msg: this.props.intl.formatMessage(
          { id: "amount rule" },
          { n: balance.amount }
        ),
      });
      return;
    }
    if (!this.state.fee) {
      this.setState({
        fee_msg: this.props.intl.formatMessage({ id: "fee required" }),
      });
      return;
    }
    if (Number(this.state.fee) < 0.001 || Number(this.state.fee) > 1) {
      this.setState({
        fee_msg: this.props.intl.formatMessage({ id: "wrong fee" }),
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
    // if (!this.state.password) {
    //   this.setState({
    //     password_msg: this.props.intl.formatMessage({
    //       id: "password is required",
    //     }),
    //   });
    //   return;
    // }
    // let pwd = helper.sha256(this.state.password);
    // if (
    //   pwd !=
    //   this.props.store.accounts[this.props.store.account_index]["password"]
    // ) {
    //   this.setState({
    //     password_msg: this.props.intl.formatMessage({
    //       id: "password is wrong",
    //     }),
    //   });
    //   return;
    // }
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const symbol = this.state.symbol.toLowerCase();
    const token = this.props.tokens.find((item) => item.symbol == symbol);
    const token_hbc = this.props.tokens.find((item) => item.symbol == "hbc");
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
          type: "hbtcchain/transfer/MsgSend",
          value: {
            from_address: address,
            to_address: this.state.to_address,
            amount: [
              {
                amount: this.decimals(this.state.amount, token.decimals),
                denom: symbol,
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
    } else {
      const err_msg =
        result.data && result.data.raw_log
          ? JSON.parse(result.data.raw_log).message
          : result.data.error || "unknown error";
      message.error(err_msg);
      this.setState({
        loading: false,
        msg:
          result.data && result.data.raw_log
            ? JSON.parse(result.data.raw_log).message
            : "unknown error",
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
          this.props.dispatch(routerRedux.goBack());
        } else {
          const err_msg = result.data.error_message
            ? result.data.error_message.message
            : "unknown error";
          message.error(err_msg);
          this.setState({
            loading: false,
            err_msg: result.data.error_message
              ? result.data.error_message.message
              : "unknown error",
          });
        }
        return;
      }
    } catch (e) {}
    await util.delay(1000);
    this.check(txhash);
  };
  symbolChange = (e) => {
    this.setState({
      symbol: e.target.value,
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const symbol = (this.state.symbol || "").toLowerCase();
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == this.state.symbol
          ) || { amount: 0 }
        : { amount: 0 };
    const rates = this.rates(balance.amount, symbol);
    const account =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]
        : {};
    return (
      <div className={classes.symbol}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.back}
        >
          <Grid item xs={2}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>
              {this.props.intl.formatMessage({
                id: "hbtcchain/transfer/MsgSend",
              })}
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div className={classes.form}>
          <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "output address" })}
            </Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              variant="outlined"
              placeholder={this.props.intl.formatMessage({
                id: "output address",
              })}
              value={account.address}
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
              {this.props.intl.formatMessage({ id: "accept address" })}
            </Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              variant="outlined"
              placeholder={this.props.intl.formatMessage({
                id: "input address",
              })}
              value={this.state.to_address}
              fullWidth
              classes={{
                root: classes.outline,
              }}
              onChange={this.handleChange("to_address")}
              error={Boolean(this.state.to_address_msg)}
              helperText={this.state.to_address_msg}
            />
          </div>
          <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "select tokens" })}
            </Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              select
              value={this.state.symbol}
              fullWidth
              onChange={this.symbolChange}
              variant="outlined"
              classes={{
                root: classes.outline,
                outlined: classes.outline_outline,
              }}
            >
              {this.props.tokens.map((item) => {
                if (item.hide) {
                  return "";
                }
                let balance =
                  this.props.balance && address && this.props.balance[address]
                    ? this.props.balance[address].assets.find(
                        (it) => it.symbol == item.symbol
                      )
                    : { amount: 0 };
                balance = balance || { amount: 0 };
                return (
                  <MenuItem value={item.symbol} key={item.symbol}>
                    {item.symbol.toUpperCase()}({balance.amount})
                  </MenuItem>
                );
              })}
            </TextField>
          </div>
          <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "transfer amount" })}
            </Grid>
            <Grid item>
              {this.props.intl.formatMessage({ id: "available" })}{" "}
              {balance.amount}
              {this.state.symbol.toUpperCase()}
            </Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              placeholder={this.props.intl.formatMessage({
                id: "input amount",
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
                        amount: balance.amount,
                        amount_msg: "",
                      });
                    }}
                    color="primary"
                    className={classes.btn_all}
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
          <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>{this.props.intl.formatMessage({ id: "mark" })}</Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input} style={{ margin: "0 0 40px" }}>
            <TextField
              variant="outlined"
              placeholder={this.props.intl.formatMessage({ id: "mark" })}
              value={this.state.memo}
              onChange={this.handleChange("memo")}
              classes={{
                root: classes.outline,
              }}
              fullWidth
              error={Boolean(this.state.memo_msg)}
              helperText={this.state.memo_msg}
            />
          </div>
          {/* <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "fee_min_max" })}
            </Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
            <Slider
              value={Number(this.state.fee)}
              onChange={this.sliderChange}
              step={0.001}
              min={0.002}
              max={1}
            />
          </div> */}
          <div className={classes.submit}>
            {this.state.loading ? (
              <Button color="primary" variant="contained" fullWidth disabled>
                <CircularProgress color="primary" />
              </Button>
            ) : (
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.submit}
              >
                {this.props.intl.formatMessage({ id: "transfer" })}
              </Button>
            )}
          </div>
        </div>
        <PasswordRC
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

export default withStyles(styles)(injectIntl(IndexRC));
