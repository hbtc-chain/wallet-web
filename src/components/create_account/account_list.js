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
      select_accounts: [],
    };
  }
  componentWillMount() {
    const accounts = this.props.store.accounts;
    const select_accounts = [].concat(this.state.select_accounts);
    if (accounts && accounts.length) {
      select_accounts.push(accounts[0]);
    }
    this.setState({
      select_accounts,
    });
  }
  import = async () => {};
  handleAccount = (data) => (e) => {
    const select_accounts = [].concat(this.state.select_accounts);
    const index = select_accounts.findIndex(
      (item) => item.username == data.username
    );
    if (index > -1) {
      select_accounts.splice(index, 1);
    } else {
      select_accounts.push(data);
    }
    this.setState({
      select_accounts,
    });
  };

  render() {
    const { classes, intl, ...otherProps } = this.props;
    const params = querystring.parse(this.props.location.search || "");
    const accounts = this.props.store.accounts;
    return (
      <div className={classes.account_select}>
        <Nav
          key="nav"
          title={intl.formatMessage({ id: "account.list.title" })}
          {...otherProps}
        />
        <div className={classes.account_con_bg}>
          <div className={classes.account_con}>
            <p>{this.props.intl.formatMessage({ id: "account.list.desc" })}</p>
            <List className={classes.account_list}>
              {accounts && accounts.length
                ? accounts.map((item, i) => {
                    const arr = this.state.select_accounts.filter(
                      (account) => account.username == item.username
                    );
                    return (
                      <ListItem
                        alignItems="center"
                        className={arr.length ? "select" : ""}
                      >
                        <ListItemAvatar>
                          <em onClick={this.handleAccount(item)}></em>
                          <CheckCircle onClick={this.handleAccount(item)} />
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
                  })
                : ""}
            </List>
          </div>
        </div>
        <div className={classes.footer}>
          <Button
            onClick={this.import}
            color="primary"
            variant="contained"
            fullWidth
            className={classes.button}
            disabled={this.state.select_accounts.length < 1}
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
