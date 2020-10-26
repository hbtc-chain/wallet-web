// 首页
import React from "react";
import { routerRedux } from "dva/router";
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
  Drawer,
  Radio,
  Menu,
  MenuItem,
  Divider,
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
import helper from "../../util/helper";
import CONST from "../../util/const";
import { v4 } from "uuid";
import util from "../../util/util";
import API from "../../util/api";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Iconfont } from "../../lib";
import route_map from "../../config/route_map";
import message from "../public/message";
import extension from "extensionizer";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      copyed: false,
      anchorEl: false,
      anchorEl2: false,
      info_dialog: false,
      dialog_sites: false,
      dialog_private_key: false,
      password_msg: "",
      password: "",
      private_key: "",
      edit_username: false,
      username: "",
      i: 0,
      tab: "Assets",
      tokens: [],
      trades: [],
      mask: true,
      chain_choose: false,
      chains: [],
      account_choose: false,
    };
  }
  componentDidMount() {
    this.get_balance();
  }
  componentDidUpdate() {
    if (!this.state.chains.length && this.props.tokens.length) {
      let chain = [];
      this.props.tokens.map((item) => {
        const index = chain.findIndex((it) => it == item.chain);
        if (index == -1) {
          chain.push(item.chain);
        }
      });
      this.setState({
        chains: chain,
      });
    }
  }

  get_balance = async () => {
    const address = this.props.store.accounts[this.props.store.account_index]
      ? this.props.store.accounts[this.props.store.account_index]["address"]
      : "";
    const balances =
      this.props.balance && address && this.props.balance[address]
        ? this.props.balance[address]
        : { assets: [] };
    const balances_json = {};
    let total = 0;
    balances.assets.map((item) => {
      balances_json[item.symbol] = item.amount;
      const d = this.rates(item.amount, item.symbol);
      if (Number(d[0])) {
        total += Number(d[0] || 0);
      }
    });
    let tokens = [];
    this.props.tokens.map((item) => {
      tokens.push({
        ...item,
        amount: balances_json[item.symbol] ? balances_json[item.symbol] : 0,
      });
    });
    // tokens.sort((a, b) => {
    //   if (a.amount == b.amount) {
    //     return a.symbol.toUpperCase() >= b.symbol.toUpperCase() ? 1 : -1;
    //   }
    //   return a.amount - b.amount >= 0 ? -1 : 1;
    // });
    this.setState({
      tokens,
      total: total,
    });
    await util.delay(2000);
    this.get_balance();
  };
  goto = () => {};
  copy = (showmessage) => () => {
    this.setState(
      {
        copyed: true,
      },
      () => {
        if (this.state.copyed) {
          if (showmessage) {
            message.success(this.props.intl.formatMessage({ id: "copyed" }));
          }
          setTimeout(() => {
            this.setState({
              copyed: false,
            });
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
      anchorEl2: null,
    });
  };
  filteraddress = (str) => {
    if (!str) {
      return "";
    }
    return str.length > 16
      ? str.replace(/^(.{8})(.{1,})(.{8})$/, ($1, $2, $3, $4) => {
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
  disconnect = (i) => (e) => {
    let sites = [...this.props.store.sites];
    sites.splice(i, 1);
    this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          sites,
        },
      },
    });
  };
  dialogChange = (key) => (e) => {
    this.setState({
      [key]: !this.state[key],
      anchorEl: null,
    });
  };
  handleChange = (key) => (e) => {
    this.setState({
      [key]: e.target.value,
    });
  };
  exportkey = () => {
    if (!this.state.password) {
      this.setState({
        password_msg: this.props.intl.formatMessage({
          id: "password is required",
        }),
      });
      return;
    }
    const pwd = helper.sha256(this.state.password);
    const account =
      this.props.store.accounts && this.props.store.account_index > -1
        ? this.props.store.accounts[this.props.store.account_index]
        : {};
    if (pwd != account.password) {
      this.setState({
        password_msg: this.props.intl.formatMessage({
          id: "password is wrong",
        }),
      });
      return;
    }
    const private_key = helper.aes_decrypt(
      account.privateKey,
      this.state.password
    );
    this.setState({
      private_key,
    });
  };
  rates = (v, t) => {
    if (this.props.tokens[this.state.i]) {
      const d = helper.rates(v, t, this.props.store.unit, this.props.rates);
      return d;
    }
    return ["", "", ""];
  };
  choose_account = (i) => () => {
    if (i == -1) {
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.create_account_step1,
        })
      );
      return;
    }
    this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          account_index: i,
        },
      },
    });
    this.setState({
      account_choose: false,
    });
  };
  choose_chain = (i) => () => {
    if (i == 0) {
      return;
    }
    this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          chain_index: i,
        },
      },
    });
    this.setState({
      chain_choose: false,
    });
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
    const address =
      this.props.store.accounts[this.props.store.account_index] &&
      this.props.store.account_index != -1
        ? this.props.store.accounts[this.props.store.account_index]["address"]
        : "";
    const username =
      this.props.store.accounts[this.props.store.account_index] &&
      this.props.store.account_index != -1
        ? this.props.store.accounts[this.props.store.account_index]["username"]
        : "";
    const chains = [];
    this.props.tokens.map((item) => {});
    const balances =
      this.props.balance && address && this.props.balance[address]
        ? this.props.balance[address]
        : { assets: [] };
    let balance = { amount: "" };
    balances.assets.map((item) => {
      if (
        this.props.tokens[this.state.i] &&
        item.symbol == this.props.tokens[this.state.i]["symbol"]
      ) {
        balance = item;
      }
    });
    return (
      <div className={classes.index}>
        <div className={classes.index_top_content}>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.index_top}
          >
            <Grid item style={{ flex: 1 }}>
              <span
                onClick={() => {
                  this.setState({
                    chain_choose: true,
                  });
                }}
              >
                <em></em>
                {this.props.store.chain[this.props.store.chain_index]["name"]}
                <ExpandMoreIcon />
              </span>
            </Grid>

            <Grid item>
              <Tooltip title={this.props.intl.formatMessage({ id: "exc" })}>
                <div>
                  <Iconfont
                    type="exc-fa"
                    size={24}
                    onClick={() => {
                      extension.tabs.create({
                        url: this.props.store.chain[
                          this.props.store.chain_index
                        ]["exc"],
                      });
                      // window.open(
                      //   this.props.store.chain[this.props.chain_index]["exc"],
                      //   "_blank"
                      // );
                    }}
                  />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={this.props.intl.formatMessage({ id: "refresh" })}>
                <div>
                  <Iconfont
                    type="refresh"
                    size={24}
                    onClick={() => {
                      window.location.reload();
                    }}
                  />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={this.props.intl.formatMessage({ id: "logout" })}>
                <div>
                  <Iconfont type="locked" size={24} onClick={this.logout} />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={this.props.intl.formatMessage({ id: "setting" })}>
                <div>
                  <Iconfont
                    type="setting"
                    size={24}
                    onClick={() => {
                      this.props.dispatch(
                        routerRedux.push({ pathname: route_map.setting })
                      );
                    }}
                  />
                </div>
              </Tooltip>
            </Grid>
          </Grid>
          <div className={classes.userinfo}>
            <span>{username}</span>
            <strong>
              {this.props.store.unit == "usd" ? "$" : ""}
              {this.props.store.unit == "cny" ? "￥" : ""}
              {Number.isNaN(this.state.total) ? "--" : this.state.total}{" "}
              {this.props.store.unit != "usd" && this.props.store.unit != "cny"
                ? (this.props.store.unit || "").toUpperCase()
                : ""}
            </strong>
            {this.state.copyed ? (
              <em className="copyed">
                <span>
                  {this.props.intl.formatMessage({ id: "copy to parse" })}
                </span>
                <span>
                  <Divider orientation="vertical" flexItem />
                  <CheckCircleIcon />
                </span>
              </em>
            ) : (
              <CopyToClipboard text={address} onCopy={this.copy(false)}>
                <em>
                  {this.filteraddress(address)} | <Iconfont type="copy" />
                </em>
              </CopyToClipboard>
            )}
            <div>
              <IconButton
                aria-controls={
                  Boolean(this.state.anchorEl2) ? "customized-menu" : undefined
                }
                aria-haspopup="true"
                onClick={(e) => {
                  this.setState({
                    anchorEl2: e.target,
                  });
                }}
                className={classes.control_btn}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
            <Menu
              id="customized-menu"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              anchorEl={this.state.anchorEl2}
              open={Boolean(this.state.anchorEl2)}
              onClose={this.handleClose}
              classes={{ list: classes.control_list }}
            >
              <MenuItem
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: route_map.account_choose,
                    })
                  );
                }}
              >
                <ListItemIcon>
                  <Iconfont type="language" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.intl.formatMessage({
                    id: "choose account",
                  })}
                />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: route_map.create_account_step3,
                      search: "type=create",
                    })
                  );
                }}
              >
                <ListItemIcon>
                  <Iconfont type="language" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.intl.formatMessage({
                    id: "create account",
                  })}
                />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: route_map.create_account_step4,
                    })
                  );
                }}
              >
                <ListItemIcon>
                  <Iconfont type="language" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.intl.formatMessage({
                    id: "import account",
                  })}
                />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: route_map.export_list,
                    })
                  );
                }}
              >
                <ListItemIcon>
                  <Iconfont type="language" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.intl.formatMessage({
                    id: "export backup account",
                  })}
                />
              </MenuItem>
            </Menu>
          </div>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.index_top_btn}
          >
            <Grid
              item
              onClick={() => {
                this.props.dispatch(
                  routerRedux.push({
                    pathname: route_map.send,
                  })
                );
              }}
            >
              {this.props.intl.formatMessage({ id: "receive payment" })}
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid
              item
              onClick={() => {
                this.props.dispatch(
                  routerRedux.push({
                    pathname: route_map.accept,
                  })
                );
              }}
            >
              {this.props.intl.formatMessage({
                id: "hbtcchain/transfer/MsgSend",
              })}
            </Grid>
          </Grid>
        </div>
        <List component="nav">
          {this.state.chains.map((item, i) => {
            let amount = 0;
            let token = this.state.tokens.find((it) => it.symbol == item);
            token = token || {};
            this.state.tokens.map((it) => {
              if (it.chain == item) {
                const rate = this.rates(
                  it.amount,
                  it.symbol,
                  this.props.store.unit,
                  this.props.rates
                );
                if (Number(rate[0])) {
                  amount += Number(rate[0]);
                }
              }
            });
            // const rates = this.rates(
            //   amount,
            //   item,
            //   this.props.store.unit,
            //   this.props.rates
            // );
            const rates2 = this.rates(
              1,
              item,
              this.props.store.unit,
              this.props.rates
            );
            return (
              <ListItem
                key={item}
                button
                className={classes.listItem}
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: route_map.chain + "/" + item,
                    })
                  );
                }}
              >
                <ListItemIcon>
                  <img
                    src={token.logo || require("../../assets/default_icon.png")}
                  />
                </ListItemIcon>
                <ListItemText>
                  <strong>
                    {(token.symbol || "").toUpperCase()}{" "}
                    {token.is_native ? (
                      <span className="native">
                        {this.props.intl.formatMessage({
                          id: "native test token list",
                        })}
                      </span>
                    ) : (
                      <span className="external">
                        {this.props.intl.formatMessage({
                          id: "external token list",
                        })}
                      </span>
                    )}
                  </strong>
                  <em>
                    {rates2[2]}
                    {rates2[0]} {rates2[1]}
                  </em>
                </ListItemText>
                <ListItemText style={{ textAlign: "right" }}>
                  <strong style={{ display: "inline" }}></strong>
                  <em>
                    {this.props.store.unit == "usd" ? "$" : ""}
                    {this.props.store.unit == "cny" ? "￥" : ""}
                    {amount}
                    {this.props.store.unit != "usd" &&
                    this.props.store.unit != "cny"
                      ? this.props.store.unit.toUpperCase()
                      : ""}
                  </em>
                </ListItemText>
              </ListItem>
            );
          })}
        </List>

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
                      <ListItem
                        button
                        className={classes.menuitem}
                        onClick={this.goto}
                      >
                        <ListItemIcon>
                          <CallMadeIcon />
                        </ListItemIcon>
                        <ListItemText>
                          {this.props.intl.formatMessage({
                            id: "account link",
                          })}
                        </ListItemText>
                      </ListItem>
                      <ListItem
                        button
                        className={classes.menuitem}
                        onClick={this.dialogChange("dialog_sites")}
                      >
                        <ListItemIcon>
                          <LinkIcon />
                        </ListItemIcon>
                        <ListItemText>
                          {this.props.intl.formatMessage({
                            id: "connected site",
                          })}
                        </ListItemText>
                      </ListItem>
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
                  onClick={() => {
                    this.closeDialog();
                    this.dialogChange("dialog_private_key")();
                  }}
                >
                  {this.props.intl.formatMessage({ id: "export private key" })}
                </Button>
              </Grid>
            </Grid>
            <IconButton className={classes.closebtn} onClick={this.closeDialog}>
              <HighlightOffIcon />
            </IconButton>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.dialog_sites}
          onClose={this.dialogChange("dialog_sites")}
        >
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "connected sites" })}
          </DialogTitle>
          <DialogContent>
            <List className={classes.sites}>
              {(this.props.store.sites || []).map((item, i) => {
                return (
                  <ListItem key={item} className={classes.site_item}>
                    <Grid container alignItems="center" justify="space-between">
                      <Grid item>
                        <p>{item}</p>
                      </Grid>
                      <Grid item>
                        <CloseIcon onClick={this.disconnect(i)} />
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
              {(this.props.store.sites || []).length == 0 ? (
                <em>{this.props.intl.formatMessage({ id: "no data" })}</em>
              ) : (
                ""
              )}
            </List>
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.dialog_private_key}>
          <DialogContent style={{ width: 300, position: "relative" }}>
            <Grid
              container
              alignItems="center"
              justify="center"
              style={{ height: 60 }}
            >
              <Grid item>
                {this.props.store.accounts[this.props.store.account_index]
                  ? this.props.store.accounts[this.props.store.account_index][
                      "username"
                    ]
                  : ""}
              </Grid>
            </Grid>
            <Grid container justify="center">
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
              <Grid item xs={12} style={{ height: 100, minHeight: 50 }}>
                {this.state.private_key ? (
                  <CopyToClipboard
                    text={this.state.private_key}
                    onCopy={this.copy(true)}
                  >
                    <p className={classes.private_key}>
                      {this.state.private_key}
                    </p>
                  </CopyToClipboard>
                ) : (
                  <TextField
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange("password")}
                    fullWidth
                    variant="outlined"
                    label={this.props.intl.formatMessage({
                      id: "enter password",
                    })}
                    helperText={this.state.password_msg}
                    error={Boolean(this.state.password_msg)}
                  />
                )}
              </Grid>
              <Grid item xs={12} style={{ height: 60 }}>
                {this.state.private_key ? (
                  <p className={classes.private_key_tip}>
                    {this.props.intl.formatMessage({ id: "private key tip" })}
                  </p>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    className={classes.btn_large}
                    disabled={!Boolean(this.state.password)}
                    onClick={this.exportkey}
                  >
                    {this.props.intl.formatMessage({
                      id: "export private key",
                    })}
                  </Button>
                )}
              </Grid>
            </Grid>
            <IconButton
              className={classes.closebtn}
              onClick={this.dialogChange("dialog_private_key")}
            >
              <HighlightOffIcon />
            </IconButton>
          </DialogContent>
        </Dialog>
        {/* {this.state.mask ? (
          <div className={classes.mask}>
            <AutorenewIcon color="primary" />
          </div>
        ) : (
          ""
        )} */}
        <Drawer
          anchor="bottom"
          open={this.state.chain_choose}
          onClose={() => {
            this.setState({ chain_choose: !this.state.chain_choose });
          }}
          classes={{
            paper: classes.drawer_paper,
          }}
        >
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.chain_choose_title}
          >
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <h2>{this.props.intl.formatMessage({ id: "choose chain" })}</h2>
            </Grid>
            <Grid item xs={2}>
              <CloseIcon
                onClick={() => {
                  this.setState({ chain_choose: !this.state.chain_choose });
                }}
              />
            </Grid>
          </Grid>
          <List className={classes.chains}>
            {this.props.store.chain.map((item, i) => {
              return (
                <ListItem key={item.name} button onClick={this.choose_chain(i)}>
                  <ListItemText>{item.name}</ListItemText>
                  <ListItemSecondaryAction>
                    {i > 0 ? (
                      <Radio
                        checked={Boolean(i == this.props.store.chain_index)}
                        color="primary"
                        onClick={this.choose_chain(i)}
                      />
                    ) : (
                      ""
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
        <Drawer
          anchor="bottom"
          open={this.state.account_choose}
          onClose={() => {
            this.setState({ account_choose: !this.state.account_choose });
          }}
          classes={{
            paper: classes.drawer_paper,
          }}
        >
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.chain_choose_title}
          >
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <h2>{this.props.intl.formatMessage({ id: "choose account" })}</h2>
            </Grid>
            <Grid item xs={2}>
              <CloseIcon
                onClick={() => {
                  this.setState({ account_choose: !this.state.account_choose });
                }}
              />
            </Grid>
          </Grid>
          <List className={classes.chains}>
            {this.props.store.accounts.map((item, i) => {
              return (
                <ListItem
                  key={item.address}
                  button
                  onClick={this.choose_account(i)}
                >
                  <ListItemText>{item.username}</ListItemText>
                  <ListItemSecondaryAction>
                    {i == this.props.store.account_index ? <CheckIcon /> : ""}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
            <ListItem button onClick={this.choose_account(-1)}>
              <ListItemText style={{ textAlign: "center" }}>
                <Iconfont type="add" size={20} />
                {this.props.intl.formatMessage({ id: "add account" })}
              </ListItemText>
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
