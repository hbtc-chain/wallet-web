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
  Divider,
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

class DelegateRC extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        description: {},
        commission: {},
      },
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    const operator_address = this.props.match.params.operator_address;
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.validators + "/" + operator_address,
    });
    if (result.code == 200 && result.data) {
      this.setState({
        data: result.data,
      });
    }
  };
  copy = () => {
    message.success(this.props.intl.formatMessage({ id: "copyed" }));
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.delegate_node_bg}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classnames(classes.back)}
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
                {this.state.data.is_key_node
                  ? this.props.intl.formatMessage({
                      id: "managed node",
                    })
                  : ""}
                {!this.state.data.is_key_node && this.state.data.is_elected
                  ? this.props.intl.formatMessage({
                      id: "consensus node",
                    })
                  : ""}
                {!this.state.data.is_key_node && !this.state.data.is_elected
                  ? this.props.intl.formatMessage({
                      id: "competing node",
                    })
                  : ""}
              </span>
            </h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          className={classes.delegate_node_name}
        >
          <Grid item>
            <strong>{this.state.data.description.moniker}</strong>
          </Grid>
          <Grid item className={this.state.data.status == 2 ? "on" : "no"}>
            <i>
              <i></i>
            </i>
            <span>
              {this.props.intl.formatMessage({
                id: this.state.data.status == 2 ? "effective" : "invalid",
              })}
            </span>
          </Grid>
        </Grid>
        <div className={classes.delegate_node_info}>
          <Grid container justify="space-between">
            <Grid item>
              <span>{this.props.intl.formatMessage({ id: "vote" })}</span>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              {this.state.data.voting_power}(
              {this.state.data.voting_power_proportion}%)
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item>
              <span>
                {this.props.intl.formatMessage({ id: "delegate self" })}
              </span>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              {this.state.data.self_delegate_amount}(
              {this.state.data.self_delegate_proportion}%)
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item>
              <span>
                {this.props.intl.formatMessage({ id: "delegate up time" })}
              </span>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              {this.state.data.up_time}%
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item>
              <span>
                {this.props.intl.formatMessage({ id: "commission.rate" })}
              </span>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              {this.state.data.commission.rate}%
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item>
              <span>
                {this.props.intl.formatMessage({ id: "last_voted_time" })}
              </span>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              {this.state.data.last_voted_time}
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item>
              <span>
                {this.props.intl.formatMessage({ id: "commission.max_rate" })}
              </span>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              {this.state.data.commission.max_rate}%
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item>
              <span>
                {this.props.intl.formatMessage({
                  id: "commission.max_change_rate",
                })}
              </span>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              {this.state.data.commission.max_change_rate}%
            </Grid>
          </Grid>
          <Divider />
          <Grid container justify="space-between">
            <Grid item>
              <span>{this.props.intl.formatMessage({ id: "cu_address" })}</span>
            </Grid>
            <CopyToClipboard
              text={this.state.data.cu_address}
              onCopy={this.copy}
            >
              <Grid
                item
                style={{
                  textAlign: "right",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {util.short_address(this.state.data.cu_address)}
                <Iconfont type="copy" size={18} style={{ color: "#3375E0" }} />
              </Grid>
            </CopyToClipboard>
          </Grid>
          <Grid container justify="space-between">
            <Grid item>
              <span>
                {this.props.intl.formatMessage({ id: "description.website" })}
              </span>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              {this.state.data.description.website}
            </Grid>
          </Grid>
          <Divider />
          <Grid container justify="space-between">
            <Grid item xs={12}>
              <span>
                {this.props.intl.formatMessage({ id: "description.details" })}
              </span>
            </Grid>
            <Grid item xs={12}>
              <p>{this.state.data.description.details}</p>
            </Grid>
          </Grid>
        </div>
        <div style={{ padding: "0 16px" }}>
          <Grid container justify="space-around">
            <Grid item xs={5}>
              <Button
                fullWidth
                color="primary"
                variant="outlined"
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname:
                        route_map.delegate_unexec +
                        "/" +
                        this.props.match.params.operator_address,
                    })
                  );
                }}
              >
                {this.props.intl.formatMessage({ id: "undelegate" })}
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname:
                        route_map.delegate_exec +
                        "/" +
                        this.props.match.params.operator_address,
                    })
                  );
                }}
              >
                {this.props.intl.formatMessage({ id: "delegate" })}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(DelegateRC));
