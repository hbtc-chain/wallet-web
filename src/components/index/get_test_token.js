// 领取测试币
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
  MenuItem,
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
      symbol: "hbc",
      address: "",
      address_msg: "",
      loading: false,
    };
  }
  componentDidMount() {
    const address =
      this.props.store.accounts.length && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]["address"]
        : "";
    this.setState({
      address,
    });
  }

  handleChange = (key) => (e) => {
    this.setState({
      [key]: e.target.value,
      password_msg: "",
    });
  };

  submit = async () => {
    if (!this.state.address) {
      this.setState({
        address_msg: this.props.intl.formatMessage({ id: "address required" }),
      });
      return;
    }
    await this.setState({
      loading: true,
    });
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url:
        API.cus +
        "/" +
        this.state.address +
        "/send_test_token?denom=" +
        this.state.symbol,
    });
    if (result.code == 200) {
      message.success("success");
    } else {
      message.error(
        result.data && result.data.error ? result.data.error : "error"
      );
    }
    this.setState({
      loading: false,
    });
  };

  symbolChange = (e) => {
    this.setState({
      symbol: e.target.value,
    });
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
            <h2>{this.props.intl.formatMessage({ id: "claim test token" })}</h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div className={classes.external_content}>
          <label className={classes.external_label}>
            {this.props.intl.formatMessage({ id: "token" })}
          </label>
          <TextField
            select
            value={this.state.symbol}
            fullWidth
            onChange={this.symbolChange}
            helperText={this.state.fee_msg}
            error={Boolean(this.state.fee_msg)}
            variant="outlined"
          >
            <MenuItem value="hbc">HBC</MenuItem>
            <MenuItem value="kiwi">KIWI</MenuItem>
          </TextField>
          <label className={classes.external_label}>
            {this.props.intl.formatMessage({ id: "address" })}
          </label>
          <TextField
            value={this.state.address}
            fullWidth
            onChange={this.handleChange("address")}
            helperText={this.state.address_msg}
            error={Boolean(this.state.address_msg)}
            variant="outlined"
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
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
