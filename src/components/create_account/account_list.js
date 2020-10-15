// 创建新账号
import React from "react";
import styles from "./index.style";
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
} from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";
import CheckCircle from "@material-ui/icons/CheckCircle";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";
import Nav from "./nav";
import classnames from "classnames";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      account_index: -1,
    };
  }
  componentWillMount() {
    this.setState({
      account_index: this.props.store.account_index,
    });
  }
  submit = async () => {
    const account_index = this.state.account_index;
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          account_index,
        },
      },
    });
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.index,
      })
    );
  };
  changeAccount = (index) => (e) => {
    this.setState({
      account_index: index,
    });
  };

  render() {
    const { classes, intl, ...otherProps } = this.props;
    const params = querystring.parse(window.location.search || "");
    const accounts = this.props.store.accounts;
    const account_index = this.state.account_index;
    return (
      <div className={classes.account_select}>
        <Nav
          key="nav"
          title={intl.formatMessage({ id: "account.list.title" })}
          url={route_map.create_account_step1}
          {...otherProps}
        />
        <div className={classes.account_con_bg}>
          <div className={classes.account_con}>
            <p>{this.props.intl.formatMessage({ id: "account.list.desc" })}</p>
            <List className={classes.account_list}>
              {accounts.map((item, i) => {
                return (
                  <ListItem
                    alignItems="center"
                    className={account_index == i ? "select" : ""}
                  >
                    <ListItemAvatar>
                      <em onClick={this.changeAccount(i)}></em>
                      <CheckCircle />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.username}
                      secondary={item.address.replace(
                        /(.{10})(.*)(.{10})/,
                        "$1......$3"
                      )}
                    />
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
        <div className={classes.footer}>
          <Button
            onClick={this.submit}
            color="primary"
            variant="contained"
            fullWidth
            className={classes.button}
            disabled={
              !(account_index > -1 && account_index < accounts.length - 1)
            }
          >
            {intl.formatMessage({
              id: "import",
            })}
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
