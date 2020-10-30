// 设置
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  Paper,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import CONST from "../../util/const";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { v4 } from "uuid";
import util from "../../util/util";
import API from "../../util/api";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from "moment";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      open2: false,
      open3: false,
    };
  }
  componentDidMount() {}
  changeRule = (k) => (e) => {
    this.props.messageManager.sendMessage({
      type: CONST.METHOD_SAVE_PASSWORD,
      data: {
        no_pwd: Boolean(k),
        password: this.props.password,
      },
    });
    this.setState({
      open3: false,
    });
  };
  changeUnit = (unit) => (e) => {
    this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          unit,
        },
      },
    });
    this.setState({
      open: false,
    });
  };
  changeLang = (lang) => async (e) => {
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          lang,
        },
      },
    });
    this.setState(
      {
        open2: false,
      },
      () => {
        window.location.reload();
      }
    );
  };
  logout = async () => {
    if (this.props.messageManager) {
      await this.props.messageManager.sendMessage({
        type: CONST.METHOD_LOGOUT,
        data: {},
      });
      await this.props.dispatch({
        type: "layout/save",
        payload: {
          store: {
            ...this.props.store,
            account_index: -1,
          },
        },
      });
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.login,
        })
      );
    }
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.symbol}>
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
            <h2>{this.props.intl.formatMessage({ id: "setting" })}</h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <List className={classes.menulist}>
          <ListItem
            className={classes.menuitem}
            onClick={() => {
              this.setState({
                open2: !this.state.open2,
              });
            }}
          >
            <ListItemText>
              {this.props.intl.formatMessage({ id: "lang" })}
            </ListItemText>
            <ListItemText
              className={classes.grey500}
              style={{ textAlign: "right" }}
            >
              {this.props.intl.formatMessage({
                id: this.props.store.lang,
              })}
            </ListItemText>
            {this.state.open2 ? (
              <ExpandLess className={classes.grey500} />
            ) : (
              <ExpandMore className={classes.grey500} />
            )}
          </ListItem>
          <Collapse in={this.state.open2} timeout="auto" unmountOnExit>
            <List component="div" className={classes.borderTop}>
              {this.props.langs.map((item) => {
                return (
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={this.changeLang(item)}
                    key={item}
                  >
                    <ListItemText className={classes.option_item}>
                      {this.props.intl.formatMessage({ id: item })}
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
          <ListItem
            className={classes.menuitem}
            onClick={() => {
              this.setState({
                open: !this.state.open,
              });
            }}
          >
            <ListItemText>
              {this.props.intl.formatMessage({ id: "rate" })}
            </ListItemText>
            <ListItemText
              className={classes.grey500}
              style={{ textAlign: "right" }}
            >
              {this.props.store.unit.toUpperCase()}
            </ListItemText>
            {this.state.open ? (
              <ExpandLess className={classes.grey500} />
            ) : (
              <ExpandMore className={classes.grey500} />
            )}
          </ListItem>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit>
            <List component="div" className={classes.borderTop}>
              {this.props.units.map((item) => {
                return (
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={this.changeUnit(item)}
                    key={item + "a"}
                  >
                    <ListItemText className={classes.option_item}>
                      {item.toUpperCase()}
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>

          <ListItem
            className={classes.menuitem}
            onClick={() => {
              this.setState({
                open3: !this.state.open3,
              });
            }}
          >
            <ListItemText>
              {this.props.intl.formatMessage({ id: "pwd_rule" })}
            </ListItemText>
            <ListItemText
              className={classes.grey500}
              style={{ textAlign: "right" }}
            >
              {this.props.intl.formatMessage({
                id: this.props.no_pwd
                  ? "30 min need pwd once"
                  : "always need pwd",
              })}
            </ListItemText>
            {this.state.open3 ? (
              <ExpandLess className={classes.grey500} />
            ) : (
              <ExpandMore className={classes.grey500} />
            )}
          </ListItem>
          <Collapse in={this.state.open3} timeout="auto" unmountOnExit>
            <List component="div" className={classes.borderTop}>
              {[0, 1].map((item) => {
                return (
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={this.changeRule(item)}
                    key={"a" + item}
                  >
                    <ListItemText className={classes.option_item}>
                      {
                        [
                          this.props.intl.formatMessage({
                            id: "always need pwd",
                          }),
                          this.props.intl.formatMessage({
                            id: "30 min need pwd once",
                          }),
                        ][item]
                      }
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </List>
        <div className={classes.btn_fixed}>
          <Button
            color="primary"
            variant="contained"
            onClick={this.logout}
            fullWidth
          >
            {this.props.intl.formatMessage({ id: "logout" })}
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
