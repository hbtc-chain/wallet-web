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
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";
import Book from "@material-ui/icons/Book";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { routerRedux } from "dva/router";
import CONST from "../../util/const";
import Nav from "./nav";
import classnames from "classnames";
import { Iconfont } from "../../lib";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  goto = (way) => (e) => {
    const search = this.props.location.search;
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.account_import,
        search: "way=" + way,
      })
    );
  };
  render() {
    const { classes, intl, ...otherProps } = this.props;
    const params = querystring.parse(this.props.location.search || "");
    return [
      <Nav
        key="nav"
        title={intl.formatMessage({ id: "create.step1.btn.import" })}
        {...otherProps}
      />,
      <div
        className={classnames(classes.step, classes.step3_import)}
        key="content"
      >
        <h2>{intl.formatMessage({ id: "import.desc" })}</h2>
        <List className={classes.import_list}>
          <ListItem alignItems="center" onClick={this.goto("seed")}>
            <ListItemAvatar>
              <Avatar>
                <Iconfont type="importbymnemonic" size={26} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={intl.formatMessage({ id: "import.way1" })}
              secondary={intl.formatMessage({ id: "import.selectway" })}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <NavigateNext />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {/* <ListItem alignItems="center" onClick={this.goto("keyStore")}>
            <ListItemAvatar>
              <Avatar>
                <Iconfont type="importbykeystore" size={26} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={intl.formatMessage({ id: "import.way2" })}
              secondary={intl.formatMessage({ id: "import.selectway" })}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <NavigateNext />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem> */}
          <ListItem alignItems="center" onClick={this.goto("key")}>
            <ListItemAvatar>
              <Avatar>
                <Iconfont type="importbyprivatekey" size={26} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={intl.formatMessage({ id: "import.way3" })}
              secondary={intl.formatMessage({ id: "import.selectway" })}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <NavigateNext />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>,
    ];
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
