// 创建新账号
import React from "react";
import styles from "./export.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";
import CheckCircle from "@material-ui/icons/CheckCircle";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";
import classnames from "classnames";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  changeAccount = (index) => () => {
    this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          account_index: index,
        },
      },
    });
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.index,
      })
    );
  };

  render() {
    const { classes, intl, dispatch, ...otherProps } = this.props;
    const accounts = this.props.store.accounts;
    const account_index = this.props.store.account_index;
    return (
      <div>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.nav}
        >
          <Grid item xs={2} style={{ padding: "0 0 0 16px" }}>
            <ArrowBackIosIcon
              onClick={() => {
                dispatch(routerRedux.goBack());
              }}
            />
          </Grid>
          <Grid item>
            <h2>{intl.formatMessage({ id: "choose account" })}</h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div className={classes.account_choose}>
          <List className={classes.account_list}>
            {accounts && accounts.length
              ? accounts.map((item, i) => {
                  return (
                    <ListItem
                      alignItems="center"
                      classes={{
                        container: account_index == i ? "select" : "",
                      }}
                      onClick={this.changeAccount(i)}
                    >
                      <ListItemText primary={item.username} />
                      <ListItemSecondaryAction onClick={this.changeAccount(i)}>
                        <em></em>
                        <CheckCircle />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })
              : ""}
          </List>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
