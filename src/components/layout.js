// layout
import React from "react";
import styles from "./layout.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import API from "../util/api";
import util from "../util/util";

class LayoutRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.default_tokens();
    this.verified_tokens();
    if (this.props.txhash) {
      this.check(this.props.txhash);
    }
  }
  check = async (txhash) => {
    try {
      const result = await this.props.dispatch({
        type: "layout/commReq",
        payload: {},
        url: API.txs + "/" + txhash,
      });
      if (result.code == 200) {
        window.localStorage.removeItem("hbc_wallet_txhash");
        this.props.dispatch({
          type: "layout/save",
          payload: {
            txhash: "",
          },
        });
        return;
      }
    } catch (e) {}
    await util.delay(1000);
    this.check(txhash);
  };
  verified_tokens = async () => {
    if (this.props.verified_tokens.length) {
      return;
    }
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.verified_tokens,
    });
    if (result.code == 200) {
      let tokens = this.props.tokens.concat(result.data);
      let newtokens = [];
      let k = {};
      tokens.map((item) => {
        if (!k[item.symbol]) {
          newtokens.push(item);
          k[item.symbol] = 1;
        }
      });
      this.props.dispatch({
        type: "layout/save",
        payload: {
          tokens: newtokens,
          verified_tokens: result.data,
        },
      });
    }
  };
  default_tokens = async () => {
    if (this.props.default_tokens.length) {
      return;
    }
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.default_tokens,
    });
    if (result.code == 200) {
      let tokens = this.props.tokens.concat(result.data);
      let newtokens = [];
      let k = {};
      tokens.map((item) => {
        if (!k[item.symbol]) {
          newtokens.push(item);
          k[item.symbol] = 1;
        }
      });
      this.props.dispatch({
        type: "layout/save",
        payload: {
          tokens: newtokens,
          default_tokens: result.data,
        },
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.g_headerBox}>
        <div className={classes.g_contentbox}>{this.props.children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(LayoutRC));
