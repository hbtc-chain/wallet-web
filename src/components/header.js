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

class HeaderRC extends React.Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      network: "HBC",
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
  selectChange = (e) => {
    this.setState({
      network: e.target.value,
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
  render() {
    const { classes } = this.props;
    return this.props.store.password ? (
      <div className={classes.g_header_box}>
        <div className={classes.g_header}>
          <Grid container alignItems="center" className={classes.logo}>
            <Grid item>
              <img src={require("../assets/logo.png")} />
            </Grid>
            <Grid item className={classes.logoname}>
              <h1>HBC WALLET</h1>
            </Grid>
          </Grid>
          <Grid container alignItems="center" justify="flex-end">
            <Grid item>
              <Select
                variant="outlined"
                value={this.state.network}
                onChange={this.selectChange}
                className={classes.network_select}
                classes={{
                  root: classes.network,
                }}
              >
                <MenuItem value="HBC">
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      {this.state.network == "HBC" ? (
                        <RadioButtonCheckedIcon
                          className={classes.network_select_icon}
                        />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </Grid>
                    <Grid item>HBC 主网</Grid>
                  </Grid>
                </MenuItem>
                <MenuItem value="HBCTEST">
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      {this.state.network == "HBCTEST" ? (
                        <RadioButtonCheckedIcon
                          className={classes.network_select_icon}
                        />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </Grid>
                    <Grid item>HBCT测试网</Grid>
                  </Grid>
                </MenuItem>
              </Select>
            </Grid>
            {this.props.store.account_index == -1 ? (
              ""
            ) : (
              <Grid item>
                <AccountCircleIcon
                  fontSize="large"
                  onClick={this.setanchorEl}
                />
              </Grid>
            )}
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
                      <ListItem className={classes.menuitem}>
                        <ListItemText>
                          {this.props.intl.formatMessage({ id: "my account" })}
                        </ListItemText>
                      </ListItem>
                      {/* <Collapse in={true} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {this.props.store.accounts.map((item, i) => {
                            return (
                              <ListItem
                                button
                                className={classes.nested}
                                onClick={this.choose(i)}
                              >
                                <ListItemIcon>
                                  {this.props.store.account_index == i ? (
                                    <CheckIcon />
                                  ) : (
                                    ""
                                  )}
                                </ListItemIcon>
                                <ListItemText>{item.username}</ListItemText>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse> */}

                      <ListItem button className={classes.menuitem}>
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
      <div className={classes.g_header}>
        <Grid container alignItems="center">
          <Grid item>
            <img src={require("../assets/logo.png")} />
          </Grid>
          <Grid item>
            <h1>HBC WALLET</h1>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(HeaderRC));
