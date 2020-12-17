// 跨链提币
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
  constructor() {
    super();
    this.state = {
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
      gas_fee: "",
      gas_fee_min: "",
      gas_fee_msg: "",
      sequence: "",
      memo: "",
      err_msg: "",
    };
  }
  componentDidMount() {
    this.init();
    this.setFee();
  }
  componentDidUpdate(preProps) {
    if (!preProps.tokens.length && this.props.tokens.length) {
      this.init();
    }
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
  init = () => {
    const symbol = this.props.match.params.symbol.toLowerCase();
    const token = this.props.tokens.find(
      (item) => item.symbol.toLowerCase() == symbol
    );
    if (token) {
      this.setState({
        gas_fee: Number(token.withdrawal_fee),
        gas_fee_min: Number(token.withdrawal_fee),
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
    const symbol = this.props.match.params.symbol.toLowerCase();
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == symbol
          ) || { amount: "" }
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
    if (
      !Number(this.state.gas_fee) ||
      /[^0-9\.]/.test(this.state.gas_fee) ||
      Number(this.state.gas_fee) < Number(this.state.gas_fee_min)
    ) {
      this.setState({
        gas_fee_msg: this.props.intl.formatMessage(
          { id: "gas fee rule" },
          { n: this.state.gas_fee_min }
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
      message.error(
        result.data.error_message
          ? result.data.error_message.message
          : "unknown error"
      );
      // this.setState({
      //   msg: this.props.intl.formatMessage({
      //     id: "create external address error",
      //   }),
      // });
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
  withdrawal = async (res) => {
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
    const symbol = this.props.match.params.symbol.toLowerCase();
    const token = this.props.tokens.find(
      (item) => item.symbol.toLowerCase() == symbol
    );
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
          type: "hbtcchain/transfer/MsgWithdrawal",
          value: {
            from_cu: address,
            to_multi_sign_address: this.state.to_address,
            symbol,
            amount: this.decimals(this.state.amount, token.decimals),
            gas_fee: this.decimals(this.state.gas_fee, token.decimals),
            order_id: v4(),
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
    const symbol = (this.props.match.params.symbol || "").toLowerCase();
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == symbol
          ) || { amount: "" }
        : { amount: "" };
    const rates = this.rates(balance.amount, symbol);
    return (
      <div className={classes.symbol}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.back}
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
              {this.props.match.params.symbol.toUpperCase()}
              {this.props.intl.formatMessage({ id: "withdrawal" })}
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <ul className={classes.withdrawl_tip}>
          <li>{this.props.intl.formatMessage({ id: "withdrawal tip 1" })}</li>
          <li>{this.props.intl.formatMessage({ id: "withdrawal tip 2" })}</li>
          <li>{this.props.intl.formatMessage({ id: "withdrawal tip 3" })}</li>
        </ul>
        <div className={classes.form}>
          <Grid
            container
            justify="space-between"
            className={classes.form_label}
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "withdrawal address" })}
            </Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              placeholder={this.props.intl.formatMessage({
                id: "input address",
              })}
              variant="outlined"
              classes={{
                root: classes.outline,
              }}
              value={this.state.to_address}
              fullWidth
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
              {this.props.intl.formatMessage({ id: "withdrawal amount" })}
            </Grid>
            <Grid item>
              {this.props.intl.formatMessage({ id: "available" })}{" "}
              {balance.amount}
              {(symbol || "").toUpperCase()}
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
              variant="outlined"
              classes={{
                root: classes.outline,
              }}
              error={Boolean(this.state.amount_msg)}
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
            <Grid item>{this.props.intl.formatMessage({ id: "gas fee" })}</Grid>
            <Grid item>{balance.amount}</Grid>
          </Grid>
          <div className={classes.form_input}>
            <TextField
              placeholder={this.props.intl.formatMessage({
                id: "input gas fee",
              })}
              value={this.state.gas_fee}
              onChange={this.handleChange("gas_fee")}
              fullWidth
              variant="outlined"
              classes={{
                root: classes.outline,
              }}
              error={Boolean(this.state.gas_fee_msg)}
              helperText={this.state.gas_fee_msg}
              InputProps={{
                endAdornment: (
                  <span className={classes.grey}>{symbol.toUpperCase()}</span>
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
              placeholder={this.props.intl.formatMessage({ id: "fee" })}
              disabled
              value={this.state.fee}
              fullWidth
              variant="outlined"
              classes={{
                root: classes.outline,
              }}
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
          {this.state.loading ? (
            <Button
              className={classes.submit}
              color="primary"
              variant="contained"
              fullWidth
              disabled
            >
              <CircularProgress color="primary" size={20} />
            </Button>
          ) : (
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={this.submit}
              className={classes.submit}
            >
              {this.props.intl.formatMessage({ id: "transfer" })}
            </Button>
          )}
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
          submit={this.withdrawal}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
