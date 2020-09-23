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

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: 0,
      trade: {},
    };
  }
  componentDidMount() {
    // 1、验证收到的 from_address 是 accounts中的某个地址，不是的话，需要拒绝sign请求
    // 2、是否登录
    this.init();
  }
  init = async () => {
    let params = querystring.parse(this.props.location.search);
    let id = params.id;
    let tabId = params.tabId;
    let all_data = await Store.get();
    let datas = (all_data.signmsgs || {})[id];
    if (datas) {
      this.setState({
        trade: datas.data,
        id,
        tabId,
      });
    } else {
    }
  };
  reject = () => {};
  sign = async () => {
    let obj = helper.jsonSort(this.state.trade);
    let account = this.props.store.accounts[this.props.store.account_index];
    let privateKey = account.privateKey;
    let publicKey = account.publicKey;

    privateKey = helper.aes_decrypt(privateKey, this.props.store.password);
    publicKey = helper.aes_decrypt(publicKey, this.props.store.password);

    const sign = helper.sign(obj, privateKey, publicKey);
    // 发送到网页
    const msg = {
      id: this.state.id,
      tabId: this.state.tabId,
      type: CONST.METHOD_SIGN,
      data: {
        req: obj,
        signature: {
          signature: sign,
          pub_key: {
            type: "tendermint/PubKeySecp256k1",
            value: publicKey,
          },
        },
      },
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
          <span>$---- USD</span>
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
                <span>$--- USD</span>
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
                <span>$--- USD</span>
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
