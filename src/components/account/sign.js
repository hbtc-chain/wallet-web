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
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    let params = querystring.parse(this.props.location.search);
    let id = params.id;
    let all_data = await Store.get();
    let datas = (all_data.signmsgs || {})[id];
    if (datas) {
      // 获取币精度
      let fee_token = datas.data.fee.amount[0].denom;
      let fee_amount = datas.data.fee.amount[0].amount;
      let msg_token = datas.data.msgs[0].value.amount[0].denom;
      let msg_amount = datas.data.msgs[0].value.amount[0].amount;

      await this.getToken(fee_token);
      await this.getToken(msg_token);

      this.setState({
        trade: datas.data,
        id,
        fee_token,
        msg_token,
        fee_amount,
        msg_amount,
      });
    }
  };
  getToken = async (token) => {
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.tokens + "/" + token,
    });
    if (result.code == 200) {
      this.setState({
        [token]: result.data,
      });
    } else {
      this.setState({
        getTokenError: result.msg,
      });
    }
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
    if (
      !this.state.fee_token ||
      !this.state.msg_token ||
      !this.state[this.state.fee_token] ||
      !this.state[this.state.msg_token] ||
      this.state.getTokenError
    ) {
      message.error(
        this.props.intl.formatMessage({ id: "token has no decimals value" })
      );
      return;
    }
    // 对amount进行精度处理
    let d = {
      chain_id: this.state.trade.chain_id,
      fee: this.state.trade.fee,
      memo: this.state.trade.memo,
      msgs: this.state.trade.msgs,
      sequence: this.state.trade.sequence,
    };

    d.fee.amount[0].amount = math
      .chain(math.bignumber(this.state.fee_amount))
      .multiply(Math.pow(10, this.state[this.state.fee_token]["decimals"]))
      .format({ notation: "fixed", precision: 1 })
      .done();

    d.msgs[0].value.amount[0].amount = math
      .chain(math.bignumber(this.state.msg_amount))
      .multiply(Math.pow(10, this.state[this.state.msg_token]["decimals"]))
      .format({ notation: "fixed", precision: 1 })
      .done();

    d.fee.amount[0].amount = `${d.fee.amount[0].amount}`.split(".")[0];
    d.msgs[0].value.amount[0].amount = `${d.msgs[0].value.amount[0].amount}`.split(
      "."
    )[0];
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
  render() {
    const { classes, password } = this.props;
    return (
      <div className={classes.sign}>
        <Grid container justify="flex-end" className={classes.network}>
          <Grid item>
            <em style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon />
              {this.state.trade.chain_id ? this.state.trade.chain_id : ""}
            </em>
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.address}
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={5}>
            <em>
              {this.state.trade.msgs &&
              this.state.trade.msgs[0] &&
              this.state.trade.msgs[0].value
                ? this.state.trade.msgs[0].value.from_address
                : ""}
            </em>
          </Grid>
          <Grid item xs={2} style={{ textAlign: "center" }}>
            <Fab color="primary">
              <ArrowForwardIcon />
            </Fab>
          </Grid>
          <Grid item xs={5}>
            <em>
              {this.state.trade.msgs &&
              this.state.trade.msgs[0] &&
              this.state.trade.msgs[0].value
                ? this.state.trade.msgs[0].value.to_address
                : ""}
            </em>
          </Grid>
        </Grid>
        <div className={classes.acount}>
          <h1>
            {this.state.trade && this.state.trade.msgs
              ? this.state.trade.msgs[0].value.amount[0].amount +
                " " +
                this.state.trade.msgs[0].value.amount[0].denom
              : ""}
          </h1>
        </div>
        <Paper square>
          <Tabs
            value={this.state.tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.tabChange}
            variant="fullWidth"
          >
            <Tab label={this.props.intl.formatMessage({ id: "details" })} />
            {/* <Tab label={this.props.intl.formatMessage({ id: "data" })} /> */}
          </Tabs>
        </Paper>
        {this.state.tab == 0 ? (
          <div className={classes.detail}>
            <Grid container justify="space-between" className={classes.item}>
              <Grid item>
                <em>GAS FEE</em>
              </Grid>
              <Grid item style={{ textAlign: "right" }}>
                <strong>
                  {this.state.trade && this.state.trade.fee
                    ? this.state.trade.fee.amount[0].amount +
                      " " +
                      this.state.trade.fee.amount[0].denom
                    : ""}
                </strong>
              </Grid>
            </Grid>
            <Grid container justify="space-between" className={classes.item}>
              <Grid item>
                <em>TOTAL</em>
              </Grid>
              <Grid item style={{ textAlign: "right" }}>
                <strong>
                  {this.state.trade && this.state.trade.msgs
                    ? this.state.trade.msgs[0].value.amount[0].amount +
                      this.state.trade.fee.gas +
                      " " +
                      this.state.trade.msgs[0].value.amount[0].denom
                    : ""}
                </strong>
              </Grid>
            </Grid>
          </div>
        ) : (
          ""
        )}
        <Grid container justify="space-around">
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
