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
        gas: "200000",
        amount: [{ denom: "hbc", amount: "12345678901234567890" }],
      },
      memo: "",
      gas: ["", ""],
      msg_amount: ["", ""],
    };
  }
  componentDidMount() {
    this.init();
  }
  /**
   * 根据token精度对amount值进行处理
   * @param {string} amount
   * @param {string} token
   * @return {string} amount
   */
  amount_count = async (amount, token) => {
    if (!amount || !token) {
      return [amount, token];
    }
    let result = {};
    if (!this.state[token]) {
      result = await this.getToken(token);
      if (result.code == 200) {
        let a = this.decimals(amount, result.data.decimals);
        return [a, token];
      }
    } else {
      let a = this.decimals(amount, this.state[token]["decimals"]);
      return [a, token];
    }
  };
  decimals = (amount, decimals) => {
    let a = math
      .chain(math.bignumber(amount))
      .divide(Math.pow(10, decimals))
      .format({ notation: "fixed", precision: 1 })
      .done();
    a = `${a}`.split(".")[0];
    return a;
  };
  init = async () => {
    let params = querystring.parse(this.props.location.search);
    let id = params.id;
    let all_data = await Store.get();
    let datas = (all_data.signmsgs || {})[id];
    // {
    //   from: "page",
    //   to: "background",
    //   id: "fed481bf-27d7-499b-9621-6610670187de",
    //   tabId: "",
    //   time: 1601298266969,
    //   type: "sign",
    //   data: {
    //     msgs: [
    //       {
    //         type: "hbtcchain/transfer/MsgSend",
    //         value: {
    //           amount: [{ denom: "hbc", amount: "12345678901234567890" }],
    //           to_address: "HBCPCkU7Hhi45YwaMZ1jg1LxCse3gojFnTqb",
    //           from_address: "HBCfJmfTLgxaXZFuanHT5RQnTXkWvfyH5AwS",
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

      this.setState(
        {
          trade: datas.data,
          id,
          fee_token,
          fee_amount,
          gas,
          msg_amount,
        },
        () => {
          console.log(this.state.trade);
        }
      );
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
    window.close();
  };
  sign = async () => {
    if (this.state.getTokenError) {
      message.error(
        this.props.intl.formatMessage({ id: "token has no decimals value" })
      );
      return;
    }
    // 对amount进行精度处理
    let d = {
      //chain_id: this.state.trade.chain_id,
      fee: this.state.fee,
      memo: this.state.memo,
      msgs: this.state.trade.msgs,
      sequence: this.state.trade.sequence,
    };

    let obj = helper.jsonSort(d);
    let account = this.props.store.accounts[this.props.store.account_index];
    let privateKey = account.privateKey;
    let publicKey = account.publicKey;

    privateKey = helper.aes_decrypt(privateKey, this.props.store.password);
    publicKey = helper.aes_decrypt(publicKey, this.props.store.password);

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
    window.close();
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
      return this.amount_count(msgs.value.amount_in, msgs.value.swap_path[0]);
    }

    // type = MsgSwapExactOut
    if (/MsgSwapExactOut/i.test(msgs.type)) {
      return this.amount_count(
        msgs.value.amount_out,
        msgs.value.swap_path[msgs.value.swap_path.length - 1]
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
    console.log(item, data);
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
  render() {
    const { classes, password } = this.props;
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
          </div>
        ) : (
          ""
        )}

        {this.state.trade.msgs
          ? Object.keys(this.state.trade.msgs[0].value)
              .sort((a, b) => (a.toUpperCase() > b.toUpperCase() ? 1 : -1))
              .map((item) => {
                if (
                  /amount|initial_deposit|coins|swap_path|expired_at|min_amount_out|max_amount_in|side|min_token_a_amount|min_token_b_amount|liquidity/i.test(
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
            <em>GAS FEE</em>
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
              onClick={this.sign}
            >
              {this.props.intl.formatMessage({ id: "confirm" })}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
