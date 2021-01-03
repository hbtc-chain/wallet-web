// 链信息
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Slider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
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
      fee: "",
      fee_msg: "",
      memo: "",
      password: "",
      password_msg: "",
      open: false,
      sequence: "",
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
  sliderChange = (e, v) => {
    this.setState({
      fee: v,
      fee_msg: "",
    });
  };
  handleChange = (key) => (e) => {
    this.setState({
      [key]: e.target.value,
      password_msg: "",
    });
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
    // if (Number(v) < 0.001) {
    //   v = 0.001;
    // }
    v = this.fix_digits(v, 3);
    this.setState({
      fee: v,
      fee_msg: "",
    });
  };
  /**
   * 精度判断
   * @param {String} v v=number时，传入999. , 返回的数值会被忽略.
   * @param {Number} digits   -10,-1,1,2,3,4
   */
  fix_digits = (v, digits) => {
    if (!digits) {
      return v ? Math.floor(v) : v;
    }
    if (!v && v !== 0) return v;
    if (digits <= 0) {
      return Math.floor(v);
    }
    let string_v = `${v}`;
    let d = string_v.split(".");
    if (!d[1] || d[1].length <= digits) {
      return string_v;
    }
    d[1] = d[1].split("");
    d[1].length = digits;
    d[1] = d[1].join("");
    return d[0] + "." + d[1];
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
  submit = async () => {
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
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
      });
    } else {
      message.error(
        this.props.intl.formatMessage({
          id: "create external address error",
        })
      );
      // this.setState({
      //   msg: this.props.intl.formatMessage({
      //     id: "create external address error",
      //   }),
      // });
      return;
    }
  };
  create_address = async (res) => {
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const symbol = this.props.match.params.symbol;
    const token = this.props.tokens.find((item) => item.symbol == symbol);
    const token_hbc = this.props.tokens.find((item) => item.symbol == "hbc");

    let d = {
      chain_id: this.props.store.chain[this.props.store.chain_index][
        "chain_id"
      ],
      fee: {
        gas: this.props.default_fee.gas, //CONST.GAS_FEE,
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
          type: "hbtcchain/keygen/MsgKeyGen",
          value: {
            order_id: v4(),
            symbol,
            from: address,
            to: address,
          },
        },
      ],
      sequence: this.state.sequence,
    };
    let obj = helper.jsonSort(d);
    let account = this.props.store.accounts[this.props.store.account_index];
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
      this.props.dispatch({
        type: "layout/save",
        payload: {
          txhash: symbol,
        },
      });
      window.localStorage.hbc_wallet_txhash = symbol;
      this.check_address();
    } else {
      message.error(
        result.data && result.data.raw_log
          ? JSON.parse(result.data.raw_log).message
          : result.data.error || "unknown error"
      );
      this.setState({
        loading: false,
      });
    }
  };
  check_address = async () => {
    const symbol = this.props.match.params.symbol;
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];
    const external_address =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == symbol
          ) || { external_address: "" }
        : { external_address: "" };
    if (external_address.external_address) {
      this.props.dispatch({
        type: "layout/save",
        payload: {
          txhash: "",
        },
      });
      window.localStorage.removeItem("hbc_wallet_txhash");
      this.props.dispatch(routerRedux.goBack());
      return;
    } else {
      await util.delay(300);
      this.check_address();
    }
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const symbol = this.props.match.params.symbol;
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const token = this.props.tokens.find((item) => item.symbol == symbol);
    const balance =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == this.props.match.params.symbol
          ) || { amount: 0 }
        : { amount: 0 };
    const balance_hbc =
      this.props.balance && this.props.balance[address]
        ? this.props.balance[address].assets.find(
            (item) => item.symbol == "hbc"
          ) || { amount: 0 }
        : { amount: 0 };
    return (
      <div className={classes.external_address}>
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
              {this.props.intl.formatMessage({ id: "create external address" })}
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div className={classes.external_content_external}>
          <p>
            {this.props.intl.formatMessage({ id: "tip" })}:
            <br />
            {this.props.intl.formatMessage(
              { id: "create external address tip" },
              { token: this.props.match.params.symbol || "".toUpperCase() }
            )}
          </p>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className="fee"
          >
            <Grid item>
              {this.props.intl.formatMessage({ id: "create external fee" })}
            </Grid>
            <Grid item>
              <em>
                {token ? token.open_fee : ""} {"HBC"}
              </em>
            </Grid>
          </Grid>
          {/* <div className={classes.external_msg}>
            {token && balance.amount - token.open_fee < 0
              ? this.props.intl.formatMessage(
                  { id: "amount not enough {token}" },
                  { token: "HBC" }
                )
              : ""}
          </div> */}
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className="fee"
          >
            <Grid item>{this.props.intl.formatMessage({ id: "fee" })}</Grid>
            <Grid item>
              <em>{this.state.fee} HBC</em>
            </Grid>
          </Grid>
          {token ? (
            <div className={classes.external_msg}>
              {balance_hbc.amount -
                this.state.fee -
                (token ? token.open_fee : 0) <
              0
                ? this.props.intl.formatMessage({ id: "fee not enough" })
                : ""}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={classes.submit}>
          {this.state.loading || this.props.txhash ? (
            <Button disabled fullWidth variant="contained" color="primary">
              <CircularProgress color="primary" size={20} />
            </Button>
          ) : (
            <Button
              onClick={this.submit}
              fullWidth
              variant="contained"
              color="primary"
              disabled={Boolean(
                balance_hbc.amount -
                  this.state.fee -
                  (token ? token.open_fee : 0) <
                  0
              )}
            >
              {this.props.intl.formatMessage({ id: "create external address" })}
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
          submit={this.create_address}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
