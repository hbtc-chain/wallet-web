// 跨链提币
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  CircularProgress,
  MenuItem,
  Popper,
  MenuList,
} from "@material-ui/core";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { v4 } from "uuid";
import util from "../../util/util";
import API from "../../util/api";
import math from "../../util/mathjs";
import message from "../public/message";
import PasswordRC from "../public/password";
import { Iconfont } from "../../lib";

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

      symbol: "",
      token: {}, // 当前选择的token
    };
  }
  componentDidMount() {
    this.init();
    this.setFee();
    let symbols = [];
    this.props.tokens.map((item) => {
      symbols.push(item.symbol);
    });
    this.props.dispatch({
      type: "layout/tokens",
      payload: {
        symbols: symbols.join(","),
      },
    });
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
    const chain = this.props.match.params.symbol;
    const token = this.props.tokens.find((item) => item.chain == chain);
    if (token) {
      this.setState({
        gas_fee: Number(token.withdrawal_fee),
        gas_fee_min: Number(token.withdrawal_fee),
        token,
        symbol: token.symbol,
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
    const chain = this.props.match.params.symbol;
    const symbol = this.state.token.symbol;
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == symbol
          ) || { amount: "" }
        : { amount: 0 };
    const balance_gas =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == chain
          ) || { amount: "" }
        : { amount: 0 };
    const balance_hbc =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == "hbc"
          ) || { amount: "" }
        : { amount: 0 };
    const max =
      symbol == chain
        ? math
            .chain(math.bignumber(balance.amount || 0))
            .subtract(math.bignumber(this.state.gas_fee || 0))
            .format({ notation: "fixed" })
            .done()
        : balance.amount;
    if (!this.state.to_address) {
      this.setState({
        to_address_msg: this.props.intl.formatMessage({ id: "input address" }),
      });
      return;
    }
    if (this.state.to_address.length < 30) {
      this.setState({
        to_address_msg: this.props.intl.formatMessage({ id: "wrong address" }),
      });
      return;
    }
    if (
      !Number(this.state.amount) ||
      /[^0-9\.]/.test(this.state.amount) ||
      Number(this.state.amount) > Number(max) ||
      Number(this.state.amount) < 0
    ) {
      this.setState({
        amount_msg: this.props.intl.formatMessage(
          { id: "amount rule" },
          {
            n: Math.max(0, max),
          }
        ),
      });
      return;
    }
    if (
      !Number(this.state.gas_fee) ||
      /[^0-9\.]/.test(this.state.gas_fee) ||
      Number(this.state.gas_fee) < Number(this.state.gas_fee_min) ||
      Number(this.state.gas_fee) < 0
    ) {
      this.setState({
        gas_fee_msg: this.props.intl.formatMessage(
          { id: "gas fee rule" },
          { n: this.state.gas_fee_min }
        ),
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
    const chain = this.props.match.params.symbol;
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const symbol = this.state.token.symbol;
    const token = this.state.token;
    const token_chain = this.props.tokens.find(
      (item) => item.symbol == token.chain
    );
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == symbol
          ) || { amount: "" }
        : { amount: 0 };
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
            gas_fee: this.decimals(this.state.gas_fee, token_chain.decimals),
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
  symbolChange = (v) => (e) => {
    const token = this.props.tokens.find((item) => item.symbol == v);
    this.setState({
      symbol: v,
      token,
      anchorEl: null,
      gas_fee: Number(token.withdrawal_fee),
      gas_fee_min: Number(token.withdrawal_fee),
    });
  };
  handleClose = () => {
    this.setState({
      anchorEl: false,
    });
  };
  handleOpen = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const chain = this.props.match.params.symbol || "";
    const symbol = this.state.symbol;
    const token = this.state.token || { name: "" };
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == this.state.token.symbol
          ) || { amount: "" }
        : { amount: "" };
    const balance_chain =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == this.state.token.chain
          ) || { amount: "" }
        : { amount: "" };
    const max =
      symbol == chain
        ? math
            .chain(math.bignumber(balance.amount || 0))
            .subtract(math.bignumber(this.state.gas_fee || 0))
            .format({ notation: "fixed" })
            .done()
        : balance.amount;
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
            <h2>{this.props.intl.formatMessage({ id: "withdrawal" })}</h2>
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
              {this.props.intl.formatMessage({ id: "select tokens" })}
            </Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              onClick={this.handleOpen}
              className={classes.symbolchoose}
            >
              <Grid item>
                {token && token.name ? token.name.toUpperCase() : ""}(
                {balance.amount || "0"})
              </Grid>
              <Grid item>
                <Iconfont type="arrowdown" size={16} />
              </Grid>
            </Grid>
            <Popper
              open={Boolean(this.state.anchorEl)}
              anchorEl={this.state.anchorEl}
              onClose={this.handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              className={classes.symbolopoer}
              style={{
                width: this.state.anchorEl
                  ? this.state.anchorEl.offsetWidth
                  : 375,
              }}
            >
              <MenuList>
                {this.props.tokens.map((item) => {
                  if (item.hide || item.chain != chain) {
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
                    <MenuItem
                      onClick={this.symbolChange(item.symbol)}
                      key={item.symbol}
                    >
                      {item.name.toUpperCase()}({balance.amount})
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Popper>
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
              {balance.amount || "--"}
              {(this.state.token.name || "").toUpperCase()}
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
                        amount: max,
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
            <Grid item>
              {this.props.intl.formatMessage({ id: "available" })}{" "}
              {balance_chain.amount || "--"}
              {(this.state.token.chain || "").toUpperCase()}
            </Grid>
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
                  <span className={classes.grey}>
                    {(this.state.token.chain || "").toUpperCase()}
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
            <Grid item>{this.props.intl.formatMessage({ id: "mark" })}</Grid>
            <Grid item></Grid>
          </Grid>
          <div className={classes.form_input}>
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
          <div className={classes.fee}>
            <span>{this.props.intl.formatMessage({ id: "fee" })}</span>
            <strong>{this.state.fee} HBC</strong>
          </div>
          <p className={classes.fee_msg}>{this.state.fee_msg}</p>
          <p className={classes.accept_tip}>
            {this.props.intl.formatMessage({ id: "tip" })}:<br />
            {this.props.intl.formatMessage({ id: "withdrawal tip desc" })}
          </p>
        </div>
        <div className={classes.submit}>
          {this.state.loading ? (
            <Button color="primary" variant="contained" fullWidth disabled>
              <CircularProgress color="primary" size={20} />
            </Button>
          ) : (
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={this.submit}
            >
              {this.props.intl.formatMessage({ id: "confirm withdrawal" })}
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
