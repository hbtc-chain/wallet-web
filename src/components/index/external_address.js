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
      fee: 0.01,
      fee_msg: "",
      memo: "",
      password: "",
      password_msg: "",
      open: false,
      sequence: "",
    };
  }
  componentDidMount() {}
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
  decimals = (amount, decimals) => {
    let a = math
      .chain(math.bignumber(amount))
      .multiply(Math.pow(10, decimals))
      .format({ notation: "fixed", precision: 0 })
      .done();
    return a;
  };
  submit = async () => {
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
    const symbol = this.props.match.params.symbol.toLowerCase();
    const token = this.props.tokens.find((item) => item.symbol == symbol);
    const token_hbc = this.props.tokens.find((item) => item.symbol == "hbc");

    let d = {
      chain_id: this.props.store.chain[this.props.store.chain_index][
        "chain_id"
      ],
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
    const symbol = this.props.match.params.symbol.toLowerCase();
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
      this.props.dispatch(routerRedux.goBack());
      return;
    } else {
      await util.delay(300);
      this.check_address();
    }
  };
  render() {
    const { classes, ...otherProps } = this.props;
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
        <div className={classes.external_content}>
          <label className={classes.external_label}>
            {this.props.intl.formatMessage({ id: "fee" })}
          </label>
          <TextField
            value={this.state.fee}
            fullWidth
            InputProps={{
              endAdornment: <span className={classes.grey}>HBC</span>,
            }}
            onChange={this.feeChange}
            helperText={this.state.fee_msg}
            error={Boolean(this.state.fee_msg)}
            variant="outlined"
          />
          <label className={classes.external_label}>
            {this.props.intl.formatMessage({ id: "fee_min_max" })}
          </label>
          <Slider
            value={Number(this.state.fee)}
            onChange={this.sliderChange}
            step={0.001}
            min={0}
            max={1}
          />
        </div>
        {this.state.loading ? (
          <Button
            disabled
            fullWidth
            variant="contained"
            color="primary"
            style={{ height: 48 }}
          >
            <CircularProgress color="primary" size={22} />
          </Button>
        ) : (
          <Button
            onClick={this.submit}
            fullWidth
            variant="contained"
            color="primary"
            style={{ height: 48 }}
          >
            {this.props.intl.formatMessage({ id: "create external address" })}
          </Button>
        )}
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
        {/* <Dialog open={this.state.open}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "confirmed password" })}
          </DialogTitle>
          <DialogContent>
            {this.state.show_pwd ? (
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
                InputProps={{
                  endAdornment: this.state.show_pwd ? (
                    <VisibilityIcon
                      onClick={() => {
                        this.setState({ show_pwd: false });
                      }}
                    />
                  ) : (
                    <VisibilityOffIcon
                      onClick={() => {
                        this.setState({ show_pwd: true });
                      }}
                    />
                  ),
                }}
              />
            ) : (
              <TextField
                value={this.state.password}
                onChange={this.handleChange("password")}
                helperText={this.state.password_msg}
                error={Boolean(this.state.password_msg)}
                label={this.props.intl.formatMessage({
                  id: "password is required",
                })}
                type="password"
                style={{ width: 260 }}
                variant="outlined"
                InputProps={{
                  endAdornment: this.state.show_pwd ? (
                    <VisibilityIcon
                      onClick={() => {
                        this.setState({ show_pwd: false });
                      }}
                    />
                  ) : (
                    <VisibilityOffIcon
                      onClick={() => {
                        this.setState({ show_pwd: true });
                      }}
                    />
                  ),
                }}
              />
            )}
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
              onClick={this.create_address}
              variant="contained"
              color="primary"
              fullWidth
              style={{ padding: 10 }}
            >
              {this.props.intl.formatMessage({ id: "confirm" })}
            </Button>
          </DialogActions>
        </Dialog> */}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
