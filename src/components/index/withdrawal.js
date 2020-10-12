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
      fee: 0.01,
      fee_msg: "",
      gas_fee: "",
      gas_fee_msg: "",
      sequence: "",
      memo: "",
      err_msg: "",
    };
  }
  componentDidMount() {}
  handleChange = (key) => (e) => {
    this.setState({
      [key]: e.target.value,
      [key + "_msg"]: "",
      err_msg: "",
    });
  };
  rates = (v, t) => {
    if (this.props.tokens[this.state.i]) {
      const d = helper.rates(v, t, this.props.store.unit, this.state.rates);
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
    if (!this.state.to_address) {
      this.setState({
        to_address_msg: this.props.intl.formatMessage({ id: "input address" }),
      });
      return;
    }
    if (!Number(this.state.amount)) {
      this.setState({
        amount_msg: this.props.intl.formatMessage({ id: "input amount" }),
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
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];

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
  decimals = (amount, decimals) => {
    let a = math
      .chain(math.bignumber(amount))
      .multiply(Math.pow(10, decimals))
      .format({ notation: "fixed", precision: 0 })
      .done();
    return a;
  };
  transfer = async () => {
    if (!this.state.password) {
      this.setState({
        password_msg: this.props.intl.formatMessage({
          id: "password is required",
        }),
      });
      return;
    }
    let pwd = helper.sha256(this.state.password);
    if (
      pwd !=
      this.props.store.accounts[this.props.store.account_index]["password"]
    ) {
      this.setState({
        password_msg: this.props.intl.formatMessage({
          id: "password is wrong",
        }),
      });
      return;
    }
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const symbol = this.props.match.params.symbol.toLowerCase();
    const token = this.props.tokens.find((item) => item.symbol == symbol);
    const token_hbc = this.props.tokens.find((item) => item.symbol == "hbc");

    let d = {
      chain_id: this.props.chain_id,
      fee: {
        gas: "200000",
        amount: [
          {
            denom: "hbc",
            amount: this.decimals(this.state.fee, token_hbc.decimals),
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

    privateKey = helper.aes_decrypt(privateKey, this.state.password);
    publicKey = helper.aes_decrypt(publicKey, this.state.password);

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
  render() {
    const { classes } = this.props;
    const symbol = (this.props.match.params.symbol || "").toLowerCase();
    const balance =
      this.props.balance && this.props.balance.assets
        ? this.props.balance.assets.find((item) => item.symbol == symbol)
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
          <Grid item xs={2}>
            <ArrowBackIosIcon
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            {this.props.match.params.symbol}
            {this.props.intl.formatMessage({ id: "withdrawal" })}
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <ul>
          <li>{this.props.intl.formatMessage({ id: "withdrawal tip 1" })}</li>
          <li>{this.props.intl.formatMessage({ id: "withdrawal tip 2" })}</li>
          <li>{this.props.intl.formatMessage({ id: "withdrawal tip 3" })}</li>
        </ul>
        <div>
          <Grid container justify="space-between">
            <Grid item>
              {this.props.intl.formatMessage({ id: "withdrawal address" })}
            </Grid>
            <Grid item></Grid>
          </Grid>
          <TextField
            placeholder={this.props.intl.formatMessage({ id: "input address" })}
            value={this.state.to_address}
            fullWidth
            onChange={this.handleChange("to_address")}
            error={Boolean(this.state.to_address_msg)}
            helperText={this.state.to_address_msg}
          />
          <br />
          <Grid container justify="space-between">
            <Grid item>
              {this.props.intl.formatMessage({ id: "withdrawal amount" })}
            </Grid>
            <Grid item>{balance.amount}</Grid>
          </Grid>
          <TextField
            placeholder={this.props.intl.formatMessage({ id: "input amount" })}
            value={this.state.amount}
            onChange={this.handleChange("amount")}
            fullWidth
            error={Boolean(this.state.amount_msg)}
            helperText={this.state.amount_msg}
            InputProps={{
              endAdornment: (
                <Button
                  onClick={() => {
                    this.setState({
                      amount: balance.amount,
                      amount_msg: "",
                    });
                  }}
                >
                  {this.props.intl.formatMessage({ id: "all" })}
                </Button>
              ),
            }}
          />
          <br />
          <Grid container justify="space-between">
            <Grid item>{this.props.intl.formatMessage({ id: "gas fee" })}</Grid>
            <Grid item>{balance.amount}</Grid>
          </Grid>
          <TextField
            placeholder={this.props.intl.formatMessage({ id: "input gas fee" })}
            value={this.state.gas_fee}
            onChange={this.handleChange("gas_fee")}
            fullWidth
            error={Boolean(this.state.gas_fee_msg)}
            helperText={this.state.gas_fee_msg}
          />
          <br />
          <Grid container justify="space-between">
            <Grid item>{this.props.intl.formatMessage({ id: "fee" })}</Grid>
            <Grid item></Grid>
          </Grid>
          <TextField
            placeholder={this.props.intl.formatMessage({ id: "fee" })}
            value={this.state.fee}
            onChange={this.feeChange}
            fullWidth
            InputProps={{
              endAdornment: <span className={classes.grey}>HBC</span>,
            }}
            error={Boolean(this.state.fee_msg)}
            helperText={this.state.fee_msg}
          />
          <Slider
            value={Number(this.state.fee)}
            onChange={this.sliderChange}
            step={0.001}
            min={0}
            max={1}
          />
          <br />

          {this.state.loading ? (
            <Button color="primary" variant="contained" fullWidth disabled>
              <CircularProgress color="primary" size="small" />
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
          <p>{this.state.err_msg}</p>
        </div>
        <Dialog open={this.state.open}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "confirmed password" })}
          </DialogTitle>
          <DialogContent>
            <TextField
              value={this.state.password}
              onChange={this.handleChange("password")}
              helperText={this.state.password_msg}
              error={Boolean(this.state.password_msg)}
              label={this.props.intl.formatMessage({
                id: "password is required",
              })}
              style={{ width: 260 }}
              variant="outlined"
              type="password"
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                this.setState({
                  open: false,
                  password: "",
                  password_msg: "",
                  loading: false,
                });
              }}
              style={{ padding: 10 }}
            >
              {this.props.intl.formatMessage({ id: "cancel" })}
            </Button>
            <Button
              onClick={this.transfer}
              variant="contained"
              color="primary"
              fullWidth
              style={{ padding: 10 }}
            >
              {this.props.intl.formatMessage({ id: "confirm" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
