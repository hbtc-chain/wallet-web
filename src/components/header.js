// header
import React from "react";
import styles from "./layout.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  Menu,
  MenuItem,
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Select,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CheckIcon from "@material-ui/icons/Check";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import SubtitlesIcon from "@material-ui/icons/Subtitles";
import { routerRedux } from "dva/router";
import route_map from "../config/route_map";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

class HeaderRC extends React.Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      open: false,
      open2: false,
    };
  }
  setanchorEl = (e) => {
    this.setState({
      anchorEl: e.target,
    });
  };
  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  choose = (i) => (e) => {
    this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          account_index: i,
        },
      },
    });
  };
  logout = async () => {
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          password: "",
          account_index: -1,
        },
      },
    });
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.login,
      })
    );
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
  render() {
    const { classes } = this.props;
    return this.props.store.password ? (
      <div className={classes.g_header_box}>
        <div className={classes.g_header}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Grid container alignItems="center" className={classes.logo}>
                <Grid item>
                  <img src={require("../assets/logo.png")} />
                </Grid>
                <Grid item className={classes.logoname}>
                  <h1>HBTC WALLET</h1>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              {this.props.store.account_index !== -1 ? (
                <AccountCircleIcon
                  fontSize="large"
                  onClick={this.setanchorEl}
                />
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </div>

        <Popper
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          placement="bottom-end"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <div>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Paper>
                    <List component="nav">
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
                      <Collapse
                        in={this.state.open2}
                        timeout="auto"
                        unmountOnExit
                      >
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
                      <Collapse
                        in={this.state.open}
                        timeout="auto"
                        unmountOnExit
                      >
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
                        button
                        className={classes.menuitem}
                        onClick={this.logout}
                      >
                        <ListItemText>
                          {this.props.intl.formatMessage({ id: "logout" })}
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Paper>
                </ClickAwayListener>
              </div>
            </Fade>
          )}
        </Popper>
      </div>
    ) : (
      <div></div>
    );
  }
}

export default withStyles(styles)(injectIntl(HeaderRC));
