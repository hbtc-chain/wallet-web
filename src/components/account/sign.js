// sign
import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  Paper,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import AddIcon from "@material-ui/icons/Add";
import { routerRedux } from "dva/router";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import helper from "../../util/helper";
import querystring from "query-string";
import Store from "../../util/store";
import util from "../../util/util";
import CONST from "../../util/const";
import API from "../../util/api";
import message from "../public/message";
import math from "../../util/mathjs";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import PasswordRC from "../public/password";
import extension from "extensionizer";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: 0,
      trade: {},
      loading: false,
      getTokenError: "",
      tokens: [],
      fee: {
        gas: CONST.GAS_FEE,
        amount: [{ denom: "hbc", amount: "10000000000000000" }],
      },
      memo: "",
      gas: ["", ""],
      msg_amount: ["", ""],
      password: "",
      password_msg: "",
      open: false,
      close: false,
    };
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate(preProps) {
    let params = querystring.parse(this.props.location.search);
    let id = params.id;
    if (!preProps.signmsgs[id] && this.props.signmsgs[id]) {
      this.init();
    }
    // 当前sign已结束
    if (!this.props.signmsgs[id] && this.state.close) {
      this.setState({
        close: true,
      });
    }
  }
  /**
   * 根据token精度对amount值进行处理
   * @param {string} amount
   * @param {string} token
   * @return {string} amount
   */
  amount_count = async (amount, token, amount2, token2) => {
    if (!amount || !token) {
      return [amount, token];
    }
    let res = [];
    let result = {};
    let result2 = {};
    if (!this.state[token]) {
      result = await this.getToken(token);
      if (result.code == 200) {
        let a = this.decimals(amount, result.data.decimals);
        res = res.concat([a, token]);
      }
    } else {
      let a = this.decimals(amount, this.state[token]["decimals"]);
      res = res.concat([a, token]);
    }
    if (amount2 && token2) {
      if (!this.state[token2]) {
        result2 = await this.getToken(token2);
        if (result2.code == 200) {
          let a = this.decimals(amount2, result2.data.decimals);
          res = res.concat([a, token2]);
        }
      } else {
        let a = this.decimals(amount2, this.state[token2]["decimals"]);
        res = res.concat([a, token2]);
      }
    }
    return res;
  };
  decimals = (amount, decimals) => {
    let a = math
      .chain(math.bignumber(amount))
      .divide(Math.pow(10, decimals))
      .format({ notation: "fixed", precision: 0 })
      .done();
    return a;
  };
  init = async () => {
    let params = querystring.parse(this.props.location.search);
    let id = params.id;
    let datas = (this.props.signmsgs || {})[id];
    // || {
    //   from: "page",
    //   to: "background",
    //   id: "fed481bf-27d7-499b-9621-6610670187de",
    //   tabId: "",
    //   time: 1601298266969,
    //   type: "sign",
    //   data: {
    //     msgs: [
    //       {
    //         type: "hbtcchain/openswap/MsgSwapExactOut",

    //         value: {
    //           from: "HBCNUcZwwDR4uxMNfYG4QwcSf4CXKm6hAx6y",

    //           referer: "HBCNUcZwwDR4uxMNfYG4QwcSf4CXKm6hAx6y",

    //           receiver: "HBCNUcZwwDR4uxMNfYG4QwcSf4CXKm6hAx6y",

    //           max_amount_in: "1000000000000",

    //           amount_out: "1000000000",

    //           swap_path: ["hbc", "btc", "usdt"],

    //           expired_at: "-1",
    //         },
    //       },
    //     ],
    //   },
    // };
    if (datas) {
      datas.data.fee = this.state.fee;
      datas.data.memo = this.state.memo;
      // 获取币精度
      let fee_token =
        datas.data.fee && datas.data.fee.amount
          ? datas.data.fee.amount[0].denom
          : "";
      let fee_amount =
        datas.data.fee && datas.data.fee.amount
          ? datas.data.fee.amount[0].amount
          : "";

      let gas = await this.amount_count(fee_amount, fee_token);
      let msg_amount = await this.renderAmount(datas.data.msgs[0]);

      this.setState({
        trade: datas.data,
        id,
        fee_token,
        fee_amount,
        gas,
        msg_amount,
      });
    }
  };
  getToken = async (token) => {
    if (this.state[token]) {
      return { code: 400 };
    }
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.tokens + "/" + token,
    });
    if (result.code == 200) {
      await this.setState({
        [token]: result.data,
      });
    } else {
      await this.setState({
        getTokenError: result.msg,
      });
    }
    return result;
  };
  reject = async () => {
    // 发送到网页
    const msg = {
      id: this.state.id,
      tabId: this.state.tabId,
      type: CONST.METHOD_SIGN,
      data: {
        code: 400,
        msg: "User rejected",
      },
    };
    if (this.props.messageManager) {
      await this.props.messageManager.sendMessage(msg);
    }
    // 由background关闭tab
    //window.close();
  };
  sign = async (res) => {
    // if (!this.state.password) {
    //   this.setState({
    //     password_msg: this.props.intl.formatMessage({
    //       id: "password is required",
    //     }),
    //   });
    //   return;
    // }
    if (this.state.getTokenError) {
      message.error(
        this.props.intl.formatMessage({ id: "token has no decimals value" })
      );
      return;
    }
    let pwd = helper.sha256(res.password);
    let index = this.props.store.accounts.map((item) => item.password == pwd);
    if (index == -1) {
      this.setState({
        password_msg: this.props.intl.formatMessage({
          id: "password is wrong",
        }),
      });
      return;
    }

    // 对amount进行精度处理
    let d = {
      chain_id: this.props.store.chain[this.props.store.chain_index][
        "chain_id"
      ],
      fee: this.state.fee,
      memo: this.state.memo,
      msgs: this.state.trade.msgs,
      sequence: this.state.trade.sequence,
    };
    let obj = helper.jsonSort(d);
    let account = this.props.store.accounts[this.props.store.account_index];
    let privateKey = account.privateKey;
    let publicKey = account.publicKey;

    privateKey = helper.aes_decrypt(privateKey, res.password);
    publicKey = helper.aes_decrypt(publicKey, res.password);

    const sign = helper.sign(obj, privateKey, publicKey);

    let data = {
      ...obj,
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
    // });

    // 发送到网页
    const msg = {
      id: this.state.id,
      tabId: this.state.tabId,
      type: CONST.METHOD_SIGN,
      data,
    };
    if (this.props.messageManager) {
      await this.props.messageManager.sendMessage(msg);
    }
    // 由background关闭tab
    //this.close();
  };

  tabChange = (e, v) => {
    this.setState({
      tab: v,
    });
  };
  renderAmount = async (msgs) => {
    if (!msgs) {
      return ["", ""];
    }
    // type = hbtcchain/transfer/MsgSend, hbtcchain/MsgDelegate, hbtcchain/MsgUndelegate,
    if (/MsgSend|MsgDelegate|MsgUndelegate|gov\/MsgDeposit/i.test(msgs.type)) {
      return this.amount_count(
        msgs.value.amount[0].amount,
        msgs.value.amount[0].denom
      );
    }
    // type = hbtcchain/transfer/MsgDeposit, hbtcchain/transfer/MsgWithdrawal,
    if (/transfer\/MsgDeposit|MsgWithdrawal/i.test(msgs.type)) {
      return this.amount_count(msgs.value.amount, msgs.value.symbol);
    }
    // type = MsgSubmitProposal
    if (/MsgSubmitProposal/i.test(msgs.type)) {
      return this.amount_count(
        msgs.value.initial_deposit[0].amount,
        msgs.value.initial_deposit[0].denom
      );
    }
    // type = MsgNewToken
    if (/MsgNewToken/i.test(msgs.type)) {
      return this.amount_count(msgs.value.total_supply, msgs.value.decimal);
    }

    // type = MsgMappingSwap
    if (/MsgMappingSwap/i.test(msgs.type)) {
      return this.amount_count(
        msgs.value.coins[0].amount,
        msgs.value.coins[0].denom
      );
    }

    // type = MsgSwapExactIn
    if (/MsgSwapExactIn/i.test(msgs.type)) {
      return this.amount_count(
        msgs.value.amount_in,
        msgs.value.swap_path[0],
        msgs.value.min_amount_out,
        msgs.value.swap_path[msgs.value.swap_path.length - 1]
      );
    }

    // type = MsgSwapExactOut
    if (/MsgSwapExactOut/i.test(msgs.type)) {
      return this.amount_count(
        msgs.value.max_amount_in,
        msgs.value.swap_path[0],
        msgs.value.amount_out,
        msgs.value.swap_path[msgs.value.swap_path.length - 1]
      );
    }

    // type = MsgAddLiquidity
    if (/MsgAddLiquidity/i.test(msgs.type)) {
      return this.amount_count(
        msgs.value.min_token_a_amount,
        msgs.value.token_a,
        msgs.value.min_token_b_amount,
        msgs.token_b
      );
    }

    // type = MsgLimitSwap
    if (/MsgLimitSwap/i.test(msgs.type)) {
      return this.amount_count(
        msgs.value.amount_in,
        msgs.value.type == 1 ? msgs.value.base_symbol : msgs.value.quote_symbol
      );
    }
    return ["", ""];
  };
  renderContent = (item, data) => {
    if (item == "content") {
      return (
        <div>
          <strong>{data.value.title}</strong>
          <p>{data.value.description}</p>
        </div>
      );
    }
    if (item == "order_ids") {
      return <span>{data.join(",")}</span>;
    }

    return data;
  };
  handleChange = (key) => (e) => {
    this.setState({
      [key]: e.target.value,
      password_msg: "",
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    return (
      <div className={classes.sign}>
        <p className={classes.sign_title}>
          {this.state.trade &&
          this.state.trade.msgs &&
          this.state.trade.msgs[0] &&
          this.state.trade.msgs[0].type
            ? this.props.intl.formatMessage({
                id: this.state.trade.msgs[0].type,
              })
            : ""}
        </p>

        {this.state.msg_amount ? (
          <div className={classes.acount}>
            <h1>
              {this.state.msg_amount[0] +
                " " +
                (this.state.msg_amount[1] || "").toUpperCase()}
            </h1>
            {this.state.msg_amount[2] ? (
              <span>
                <ArrowDownwardIcon color="primary" />
              </span>
            ) : (
              ""
            )}
            {this.state.msg_amount[2] ? (
              <h1>
                {this.state.msg_amount[2] +
                  " " +
                  (this.state.msg_amount[3] || "").toUpperCase()}
              </h1>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        {this.state.trade.msgs
          ? Object.keys(this.state.trade.msgs[0].value)
              .sort((a, b) => (a.toUpperCase() > b.toUpperCase() ? 1 : -1))
              .map((item) => {
                if (
                  /amount|initial_deposit|coins|swap_path|expired_at|min_amount_out|max_amount_in|side|liquidity|token_a|token_b|price|order_id/i.test(
                    item
                  )
                ) {
                  return "";
                }
                const data = this.state.trade.msgs[0].value[item];
                return (
                  <Grid container key={item} className={classes.item}>
                    <Grid item xs={4}>
                      {this.props.intl.formatMessage({ id: item })}
                    </Grid>
                    <Grid item xs={8} className={classes.item_content}>
                      {this.renderContent(item, data)}
                    </Grid>
                  </Grid>
                );
              })
          : ""}
        <Grid container justify="space-between" className={classes.item}>
          <Grid item>
            <em>{this.props.intl.formatMessage({ id: "GAS FEE" })}</em>
          </Grid>
          <Grid item style={{ textAlign: "right" }}>
            <strong>
              {this.state.gas[0] +
                " " +
                (this.state.gas[1] || "").toUpperCase()}
            </strong>
          </Grid>
        </Grid>
        <Grid container justify="space-between" className={classes.item}>
          <Grid item>
            <em>{this.props.intl.formatMessage({ id: "memo" })}</em>
          </Grid>
          <Grid item style={{ textAlign: "right" }}>
            <strong>{this.state.memo}</strong>
          </Grid>
        </Grid>

        {this.state.close ? (
          <Grid container justify="space-around" style={{ margin: "10px 0 0" }}>
            <Grid item xs={5}>
              <Button
                fullWidth
                variant="contained"
                className={classes.btn_large}
              >
                {this.props.intl.formatMessage({ id: "sign closed" })}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container justify="space-around" style={{ margin: "10px 0 0" }}>
            <Grid item xs={5}>
              <Button
                fullWidth
                variant="contained"
                className={classes.btn_large}
                onClick={this.reject}
              >
                {this.props.intl.formatMessage({ id: "reject" })}
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.btn_large}
                onClick={() => {
                  this.setState({ open: true });
                }}
              >
                {this.props.intl.formatMessage({ id: "confirm" })}
              </Button>
            </Grid>
          </Grid>
        )}
        <PasswordRC
          {...otherProps}
          open={this.state.open}
          cancel={() => {
            this.setState({ open: false });
          }}
          submit={this.sign}
        />
        {/* <Dialog open={this.state.open}>
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
                this.setState({ open: false, password: "", password_msg: "" });
              }}
              style={{ padding: 10 }}
            >
              {this.props.intl.formatMessage({ id: "cancel" })}
            </Button>
            <Button
              onClick={this.sign}
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
