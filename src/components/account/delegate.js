// 委托,解委托

import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  Drawer,
  Avatar,
  Tabs,
  Tab,
  Paper,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import classnames from "classnames";
import util from "../../util/util";
import { Iconfont } from "../../lib";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Qrcode from "qrcode";
import CloseIcon from "@material-ui/icons/Close";
import message from "../public/message";
import API from "../../util/api";
import math from "../../util/mathjs";
import PassowrdRC from "../public/password";

class DelegateRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      v: "",
      data: [],
      tab: 0,
      sequence: "",
      open: false,
      msg: "",
      err_msg: "",
      memo: "",
      validator_list: [],
    };
  }
  componentDidMount() {
    const account =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]
        : {};
    this.qrcode(account.address);
    this.init();
    this.get_validator_list();
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
  get_validator_list = async () => {
    const account =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]
        : {};
    if (!account.address) {
      return;
    }
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.cus + `/${account.address}/delegations`,
    });
    if (result.code == 200 && result.data) {
      this.setState({
        validator_list: result.data,
      });
    }
  };
  init = async () => {
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.validators,
    });
    if (result.code == 200 && result.data) {
      this.setState({
        data: result.data,
      });
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
  setFee = () => {
    const token_hbc = this.props.tokens.find((item) => item.symbol == "hbc");
    if (token_hbc && this.props.default_fee.fee) {
      this.setState({
        fee: this.decimals(this.props.default_fee.fee, -token_hbc.decimals, 1),
      });
    }
  };
  show = () => {
    this.setState({ open: true });
  };
  copy = () => {
    message.success(this.props.intl.formatMessage({ id: "copyed" }));
  };
  qrcode = async (str) => {
    if (!str) {
      return "";
    }
    if (this.state[str]) {
      return this.state[str];
    }
    const img = await Qrcode.toDataURL(str, { width: 520 });
    this.setState({
      [str]: img,
    });
  };
  searchChange = (e) => {
    this.setState({
      v: e.target.value.replace(/\s/g, ""),
    });
  };
  choose = (n) => (e) => {
    this.setState({
      tab: n,
    });
  };
  goto = (address) => (e) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.delegate_node + "/" + address,
      })
    );
  };
  submit = async () => {
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
        open2: true,
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
  transfer = async (res) => {
    const address = this.props.store.accounts[this.props.store.account_index][
      "address"
    ];

    let msgs = [];
    this.state.validator_list.map((item) => {
      msgs.push({
        type: "hbtcchain/MsgWithdrawDelegationReward",
        value: {
          delegator_address: address,
          validator_address: item.validator,
        },
      });
    });
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
      msgs,
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
          message.success(
            this.props.intl.formatMessage({
              id: "MsgWithdrawDelegationReward success",
            })
          );
          //this.props.dispatch(routerRedux.goBack());
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
    const account =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]
        : {};
    const token = this.props.tokens.find((item) => item.symbol == "hbc") || {};
    return (
      <div className={classes.delegate}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classnames(classes.back, classes.back3)}
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
              <span>
                {this.props.intl.formatMessage({
                  id: "delegate and undelegate",
                })}
              </span>
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Grid
          container
          className={classes.delegate_title}
          justify="space-between"
        >
          <Grid item>{account.username}</Grid>
          <Grid item className="address" onClick={this.show}>
            {util.short_address(account.address)}
            <Iconfont type="QRcode" size={16} />
          </Grid>
        </Grid>
        <Paper square={2} className={classes.delegate_info}>
          <Grid container justify="space-between" wrap>
            <Grid item xs={4}>
              <span>
                {this.props.intl.formatMessage({ id: "available" })}HBC
              </span>
              <em>{this.props.balance.available}</em>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "center" }}>
              <span>
                {this.props.intl.formatMessage({ id: "delegateing" })}
              </span>
              <em>{this.props.balance.bonded}</em>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <span>{this.props.intl.formatMessage({ id: "ransoming" })}</span>
              <em>{this.props.balance.unbonding}</em>
            </Grid>
            <Grid item xs={4}>
              <span>{this.props.intl.formatMessage({ id: "incomed" })}</span>
              <em>{this.props.balance.claimed_reward}</em>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "center" }}>
              <span>{this.props.intl.formatMessage({ id: "incoming" })}</span>
              <em>{this.props.balance.unclaimed_reward}</em>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!Boolean(this.props.balance.unclaimed_reward)}
                style={{ height: 32, borderRadius: 16, color: "#fff" }}
                onClick={this.submit}
              >
                {this.props.intl.formatMessage({ id: "receive income" })}
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <div className={classes.delegate_tabs}>
          <span
            className={this.state.tab == 0 ? "on" : ""}
            onClick={this.choose(0)}
          >
            {this.props.intl.formatMessage({ id: "managed node" })}
            <i></i>
          </span>
          <span
            className={this.state.tab == 1 ? "on" : ""}
            onClick={this.choose(1)}
          >
            {this.props.intl.formatMessage({ id: "consensus node" })}
            <i></i>
          </span>
          <span
            className={this.state.tab == 2 ? "on" : ""}
            onClick={this.choose(2)}
          >
            {this.props.intl.formatMessage({ id: "competing node" })}
            <i></i>
          </span>
        </div>
        <div style={{ padding: "0 16px 16px" }}>
          <TextField
            fullWidth
            value={this.state.v}
            onChange={this.searchChange}
            placeholder={this.props.intl.formatMessage({
              id: "search node name",
            })}
            variant="outlined"
            classes={{
              root: classes.search_input,
            }}
            InputProps={{
              startAdornment: <Iconfont type="search" />,
              endAdornment: this.state.v ? (
                <CloseIcon
                  style={{ fontSize: 14 }}
                  onClick={() => {
                    this.setState({ v: "" });
                  }}
                />
              ) : (
                ""
              ),
            }}
          />
        </div>
        <div className={classes.node_list}>
          {this.state.data
            .filter((item) => {
              if (this.state.tab == 0) {
                return (
                  item.is_key_node &&
                  item.description.moniker.indexOf(this.state.v) > -1
                );
              }
              if (this.state.tab == 1) {
                return (
                  !item.is_key_node &&
                  item.is_elected &&
                  item.description.moniker.indexOf(this.state.v) > -1
                );
              }
              if (this.state.tab == 2) {
                return (
                  !item.is_key_node &&
                  !item.is_elected &&
                  item.description.moniker.indexOf(this.state.v) > -1
                );
              }
            })
            .map((item) => {
              return (
                <Paper
                  className={classes.delegate_node}
                  key={item.cons_address}
                  onClick={this.goto(item.operator_address)}
                >
                  <Grid container justify="space-between">
                    <Grid item>
                      <strong>
                        {util.short_address(item.description.moniker, 18)}
                      </strong>
                    </Grid>
                    <Grid item>
                      {item.status == 2 ? (
                        <i>
                          <i></i>
                        </i>
                      ) : (
                        <i className="no">
                          <i></i>
                        </i>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container justify="space-between">
                    <Grid item>
                      <span>
                        {this.props.intl.formatMessage({ id: "vote" })}
                      </span>
                      <em>{item.voting_power_proportion}%</em>
                    </Grid>
                    <Grid item style={{ textAlign: "center" }}>
                      <span>
                        {this.props.intl.formatMessage({ id: "delegate self" })}
                      </span>
                      <em>{item.self_delegate_proportion}%</em>
                    </Grid>
                    <Grid item style={{ textAlign: "right" }}>
                      <span>
                        {this.props.intl.formatMessage({
                          id: "commission rate",
                        })}
                      </span>
                      <em>{item.commission.rate}%</em>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
        </div>

        <Drawer
          anchor="bottom"
          open={this.state.open}
          onClose={() => {
            this.setState({ open: !this.state.open });
          }}
          classes={{
            paper: classes.drawer_paper,
          }}
        >
          <div className={classes.drawer}>
            <div className={classes.drawer_title}>
              {token.logo ? (
                <img src={token.logo} />
              ) : (
                <Avatar>
                  {(token.name || "H").split("")[0].toUpperCase()}
                </Avatar>
              )}
            </div>
            <h2>HBC Address</h2>
            {account.address && this.state[account.address] ? (
              <img src={this.state[account.address]} />
            ) : (
              ""
            )}
            <p>{account.address}</p>
            <CopyToClipboard text={account.address} onCopy={this.copy}>
              <Button
                fullWidth
                color="primary"
                variant="outlined"
                style={{ height: 56, fontSize: 16 }}
              >
                {this.props.intl.formatMessage({ id: "copy address" })}
              </Button>
            </CopyToClipboard>
            <CloseIcon
              className={classes.icon_close}
              onClick={() => {
                this.setState({
                  open: false,
                });
              }}
            />
          </div>
        </Drawer>
        <PassowrdRC
          {...otherProps}
          open={this.state.open2}
          cancel={() => {
            this.setState({
              open2: false,
              loading: false,
            });
          }}
          mark_info={this.props.intl.formatMessage(
            { id: "receive fee {v} hbc" },
            { v: this.state.fee }
          )}
          submit={this.transfer}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(DelegateRC));
