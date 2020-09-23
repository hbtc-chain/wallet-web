// 首页
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  Paper,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Popper,
  Fade,
  ClickAwayListener,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CheckIcon from "@material-ui/icons/Check";
import LinkIcon from "@material-ui/icons/Link";
import CallMadeIcon from "@material-ui/icons/CallMade";
import SubtitlesIcon from "@material-ui/icons/Subtitles";
import EditIcon from "@material-ui/icons/Edit";
import Qrcode from "qrcode";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CloseIcon from "@material-ui/icons/Close";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      copyed: false,
      anchorEl: false,
      info_dialog: false,
      edit_username: false,
      username: "",
      i: 0,
      tab: "Assets",
      tokenList: [
        {
          tokenId: "ETH",
          tokenName: "ETH",
          tokenUrl: require("../../assets/BTC.svg"),
        },
        {
          tokenId: "BTC",
          tokenName: "BTC",
          tokenUrl: require("../../assets/BTC.svg"),
        },
      ],
      trades: [],
    };
  }
  componentDidMount() {}
  copy = () => {
    this.setState(
      {
        copyed: !this.state.copyed,
      },
      () => {
        if (this.state.copyed) {
          setTimeout(() => {
            this.copy();
          }, 5000);
        }
      }
    );
  };
  choose = (i) => (e) => {
    this.setState({
      i,
    });
  };
  tabChange = (e, v) => {
    this.setState({
      tab: v,
    });
  };
  setanchorEl = (e) => {
    this.setState({
      anchorEl: e.target,
    });
  };
  change = (key, v) => (e) => {};
  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  filteraddress = (str) => {
    if (!str) {
      return "";
    }
    return str.length > 8
      ? str.replace(/^(.{4})(.{1,})(.{4})$/, ($1, $2, $3, $4) => {
          return $2 + "..." + $4;
        })
      : str;
  };
  // 保存名称
  savename = () => {
    let info = this.props.store.accounts[this.props.store.account_index];
    info.username = this.state.username;
    let accounts = this.props.store.accounts;
    accounts[this.props.store.account_index] = info;
    this.setState({
      accounts,
      username: "",
      edit_username: false,
    });
  };
  showchangename = () => {
    this.setState({
      username: this.props.store.accounts[this.props.store.account_index][
        "username"
      ],
      edit_username: true,
    });
  };
  changename = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  qrcode = async (str) => {
    if (!str) {
      return "";
    }
    if (this.state[str]) {
      return this.state[str];
    }
    const img = await Qrcode.toDataURL(str);
    this.setState({
      [str]: img,
    });
  };
  openInfoDialog = async () => {
    let address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    await this.qrcode(address);
    this.setState({
      anchorEl: null,
      info_dialog: true,
    });
  };
  closeDialog = () => {
    this.setState({
      info_dialog: false,
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.index}>
        <Paper variant="outlined" className={classes.indexpaper}>
          <Grid container alignItems="center" className={classes.address_title}>
            <Grid item style={{ flex: 1 }}>
              <Tooltip
                arrow
                disableFocusListener
                title={this.props.intl.formatMessage({
                  id: this.state.copyed ? "copyed" : "copy to parse",
                })}
              >
                <div className={classes.address}>
                  <CopyToClipboard
                    text={
                      this.props.store.accounts[this.props.store.account_index]
                        ? this.props.store.accounts[
                            this.props.store.account_index
                          ]["address"]
                        : ""
                    }
                    onCopy={this.copy}
                  >
                    <div>
                      <strong>
                        {this.props.store.accounts[
                          this.props.store.account_index
                        ]
                          ? this.props.store.accounts[
                              this.props.store.account_index
                            ]["username"]
                          : ""}
                      </strong>
                      <em>
                        {this.filteraddress(
                          this.props.store.accounts[
                            this.props.store.account_index
                          ]
                            ? this.props.store.accounts[
                                this.props.store.account_index
                              ]["address"]
                            : ""
                        )}
                      </em>
                    </div>
                  </CopyToClipboard>
                </div>
              </Tooltip>
            </Grid>
            <Grid
              item
              style={{ width: 40, position: "absolute", right: 10, top: 7 }}
            >
              <IconButton onClick={this.setanchorEl}>
                <MoreVertIcon />
              </IconButton>
            </Grid>
          </Grid>
          <div className={classes.token}>
            {this.state.tokenList[this.state.i] &&
            this.state.tokenList[this.state.i]["tokenUrl"] ? (
              <img src={this.state.tokenList[this.state.i]["tokenUrl"]} />
            ) : (
              <img src={require("../../assets/default_token.svg")} />
            )}
            <strong>
              4.333{" "}
              {this.state.tokenList[this.state.i]
                ? this.state.tokenList[this.state.i]["tokenName"]
                : ""}
            </strong>
            <em>$12.3123 USD</em>
            {/* <Button color="primary" variant="contained">
              BUY
            </Button> */}
          </div>
          <Paper square>
            <Tabs
              value={this.state.tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.tabChange}
              variant="fullWidth"
            >
              <Tab label="Assets" value="Assets" />
              <Tab label="Activity" value="Activity" />
            </Tabs>
          </Paper>
          {this.state.tab == "Assets" ? (
            <List component="nav">
              {this.state.tokenList.map((item, i) => {
                return (
                  <ListItem
                    key={item.tokenId}
                    onClick={this.choose(i)}
                    button
                    className={classes.listItem}
                  >
                    <ListItemIcon>
                      <img src={item.tokenUrl} />
                    </ListItemIcon>
                    <ListItemText>
                      <strong>0.00 {item.tokenName}</strong>
                      <em>$0.00 USD</em>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {i == this.state.i ? <CheckIcon /> : ""}
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            ""
          )}
          {this.state.tab == "Activity" ? (
            <List component="nav">
              {this.state.trades.map((item, i) => {
                return (
                  <ListItem
                    key={item.tokenId}
                    onClick={this.choose(i)}
                    button
                    className={classes.listItem}
                  >
                    <ListItemIcon>
                      <img src={item.tokenUrl} />
                    </ListItemIcon>
                    <ListItemText>{item.tokenName}</ListItemText>
                    <ListItemSecondaryAction>
                      {i == this.state.i ? <CheckIcon /> : ""}
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
              {this.state.trades.length == 0 ? (
                <ListItem>
                  <p className={classes.nodata}>
                    {this.props.intl.formatMessage({ id: "no data" })}
                  </p>
                </ListItem>
              ) : (
                ""
              )}
            </List>
          ) : (
            ""
          )}
        </Paper>
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
                        button
                        className={classes.menuitem}
                        onClick={this.openInfoDialog}
                      >
                        <ListItemIcon>
                          <SubtitlesIcon />
                        </ListItemIcon>
                        <ListItemText>
                          {this.props.intl.formatMessage({
                            id: "account info",
                          })}
                        </ListItemText>
                      </ListItem>
                      <ListItem button className={classes.menuitem}>
                        <ListItemIcon>
                          <CallMadeIcon />
                        </ListItemIcon>
                        <ListItemText>
                          {this.props.intl.formatMessage({
                            id: "account link",
                          })}
                        </ListItemText>
                      </ListItem>
                      {/* <ListItem button className={classes.menuitem}>
                        <ListItemIcon>
                          <LinkIcon />
                        </ListItemIcon>
                        <ListItemText>
                          {this.props.intl.formatMessage({
                            id: "connected site",
                          })}
                        </ListItemText>
                      </ListItem> */}
                    </List>
                  </Paper>
                </ClickAwayListener>
              </div>
            </Fade>
          )}
        </Popper>
        <Dialog open={this.state.info_dialog}>
          <DialogContent style={{ width: 300, position: "relative" }}>
            <Grid
              container
              alignItems="center"
              justify="center"
              style={{ height: 60 }}
            >
              <Grid item>
                {this.state.edit_username ? (
                  <TextField
                    value={this.state.username}
                    onChange={this.changename}
                    variant="outlined"
                  />
                ) : this.props.store.accounts[
                    this.props.store.account_index
                  ] ? (
                  this.props.store.accounts[this.props.store.account_index][
                    "username"
                  ]
                ) : (
                  ""
                )}
              </Grid>
              <Grid item>
                {this.state.edit_username ? (
                  <CheckIcon onClick={this.savename} />
                ) : (
                  <EditIcon onClick={this.showchangename} />
                )}
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid item xs={12} style={{ height: 160 }}>
                {this.props.store.accounts[this.props.store.account_index] ? (
                  <img
                    src={
                      this.state[
                        this.props.store.accounts[
                          this.props.store.account_index
                        ]["address"]
                      ]
                    }
                    style={{ height: 160, display: "block", margin: "0 auto" }}
                  />
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={12} style={{ height: 100 }}>
                <TextField
                  value={
                    this.props.store.accounts[this.props.store.account_index]
                      ? this.props.store.accounts[
                          this.props.store.account_index
                        ]["address"]
                      : ""
                  }
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} style={{ height: 60 }}>
                <Button
                  href={""}
                  color="primary"
                  variant="contained"
                  fullWidth
                  className={classes.btn_large}
                >
                  {this.props.intl.formatMessage({ id: "account link" })}
                </Button>
              </Grid>
              <Grid item xs={12} style={{ height: 60 }}>
                <Button
                  href={""}
                  color="primary"
                  variant="contained"
                  fullWidth
                  className={classes.btn_large}
                >
                  {this.props.intl.formatMessage({ id: "import private key" })}
                </Button>
              </Grid>
            </Grid>
            <IconButton className={classes.closebtn} onClick={this.closeDialog}>
              <HighlightOffIcon />
            </IconButton>
          </DialogContent>
        </Dialog>
        {/* <Dialog open={true}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "connected sites" })}
          </DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <ListItemText>www.hbc.com</ListItemText>
                <ListItemSecondaryAction>
                  <CloseIcon />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </DialogContent>
        </Dialog> */}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
