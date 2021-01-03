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
  DialogActions,
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
import util from "../../util/util";
import API from "../../util/api";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Iconfont } from "../../lib";
import route_map from "../../config/route_map";
import message from "../public/message";
import extension from "extensionizer";
import classnames from "classnames";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

let timer = null;
class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      copyed: false,
      anchorEl: false,
      anchorEl2: false,
      delete_account: false,
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
      announcements: [],
      activeStep: 0,
    };
  }
  componentDidMount() {
    timer = true;
    this.chains();
    this.get_balance();
    this.announcements();
  }
  componentWillUnmount() {
    timer = false;
  }
  announcements = async () => {
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {
        lang: this.props.store.lang,
      },
      url: API.announcements,
    });
    if (result.code == 200 && result.data) {
      this.setState({
        announcements: result.data,
      });
    }
  };
  async chains() {
    const result = await this.props.dispatch({
      type: "layout/commReq",
      payload: {},
      url: API.chains,
    });
    if (result.code == 200 && result.data) {
      this.setState({
        chains: result.data,
      });
      let symbols = [];
      result.data.map((item) => {
        symbols.push(item.chain);
      });
      this.props.dispatch({
        type: "layout/tokens",
        payload: {
          symbols: symbols.join(","),
        },
      });
    }
  }

  get_balance = async () => {
    if (!timer) {
      return;
    }
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
      const token = this.props.tokens.find((it) => it.symbol == item.symbol);
      const d = this.rates(item.amount, item.symbol);
      if (Number(d[0]) && token && !token.hide) {
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
      total: util.fix_digits(total, 2),
    });
    await util.delay(2000);
    this.get_balance();
  };
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
  choose_chain = (i) => async () => {
    if (i == 0) {
      return;
    }
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          chain_index: i,
        },
      },
    });
    this.setState(
      {
        chain_choose: false,
      },
      () => {
        this.props.dispatch({
          type: "layout/default_fee",
          payload: {},
        });
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
  delete_account = () => {
    let accounts = [...this.props.store.accounts];
    let account_index = this.props.store.account_index;
    accounts.splice(account_index, 1);
    account_index =
      accounts.length - 1 < account_index ? accounts.length - 1 : account_index;
    this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          accounts,
          account_index,
        },
      },
    });
    if (account_index > -1) {
      this.setState({
        delete_account: false,
      });
    } else {
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.welcome,
        })
      );
    }
  };
  goto = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.test_token,
      })
    );
  };
  remove = (n) => (e) => {
    let data = this.state.announcements;
    data.splice(n, 1);
    this.setState({
      announcements: data,
      activeStep: Math.min(this.state.activeStep, data.length - 1),
    });
  };
  handleStepChange = (n) => {
    this.setState({
      activeStep: n,
    });
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
    let balance = {};
    const balances =
      this.props.balance && address && this.props.balance[address]
        ? this.props.balance[address]
        : { assets: [] };
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
                style={{
                  height: 24,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <em></em>
                {this.props.store.chain[this.props.store.chain_index]["name"]}
                <Iconfont type="arrowdown21" />
              </span>
            </Grid>

            <Grid
              item
              style={{
                padding: "0 10px 0 0",
                borderRight: "1px solid rgba(255,255,255,.3)",
              }}
            >
              <Tooltip title={this.props.intl.formatMessage({ id: "exc" })}>
                <div>
                  <Iconfont
                    type="exc-fa"
                    size={24}
                    onClick={() => {
                      extension.tabs.create({
                        url:
                          this.props.store.chain[this.props.store.chain_index][
                            "exc"
                          ] +
                          "?lang=" +
                          this.props.store.lang,
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
            <Grid item style={{ padding: "0 4px 0 8px" }}>
              <Tooltip title={this.props.intl.formatMessage({ id: "locked" })}>
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
            <p>
              {this.props.intl.formatMessage({ id: "hello" })},{username}
              {this.props.store.chain_index == 1 ? (
                <span className="test_token" onClick={this.goto}>
                  {this.props.intl.formatMessage({ id: "claim test token" })}
                </span>
              ) : (
                ""
              )}
            </p>
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
                  {this.filteraddress(address)} |{" "}
                  <Iconfont type="copy" size={20} />
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
              getContentAnchorEl={null}
              keepMounted
              anchorEl={this.state.anchorEl2}
              open={Boolean(this.state.anchorEl2)}
              onClose={this.handleClose}
              classes={{ list: classes.control_list }}
            >
              <MenuItem
                onClick={() => {
                  extension.tabs.create({ url: "index.html" });
                  // window.open(
                  //   "chrome-extension://abhehknhgkpgodifpecmdilkdnbgkabn/index.html#/welcome",
                  //   "_blank"
                  // );
                }}
              >
                <ListItemIcon>
                  <Iconfont type="expandview" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.intl.formatMessage({
                    id: "Expand view",
                  })}
                />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  window.open(
                    this.props.store.chain[this.props.store.chain_index][
                      "explorer"
                    ] +
                      "/account/" +
                      address,
                    "_blank"
                  );
                }}
              >
                <ListItemIcon>
                  <Iconfont type="explorer" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.intl.formatMessage({
                    id: "View on Explorer",
                  })}
                />
              </MenuItem>

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
                  <Iconfont type="switchaccount" size={22} />
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
                  <Iconfont type="addaccount" size={22} />
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
                  <Iconfont type="inportaccount" size={22} />
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
                  <Iconfont type="exportaccount" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.intl.formatMessage({
                    id: "export backup account",
                  })}
                />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.setState({
                    delete_account: true,
                    anchorEl2: null,
                  });
                }}
              >
                <ListItemIcon>
                  <Iconfont type="deleteaccount" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.intl.formatMessage({
                    id: "delete account",
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
                    pathname: route_map.accept,
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
                    pathname: route_map.send,
                  })
                );
              }}
            >
              {this.props.intl.formatMessage({
                id: "hbtcchain/transfer/MsgSend",
              })}
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid
              item
              onClick={() => {
                this.props.dispatch(
                  routerRedux.push({
                    pathname: route_map.delegate,
                  })
                );
              }}
            >
              {this.props.intl.formatMessage({
                id: "hbtcchain/MsgDelegate",
              })}
            </Grid>
          </Grid>
        </div>
        {this.state.announcements.length > 0 ? (
          <div className={classes.message}>
            <AutoPlaySwipeableViews
              axis={"y"}
              className={classes.swipeView}
              index={this.state.activeStep}
              onChangeIndex={this.handleStepChange}
              enableMouseEvents
              containerStyle={{ height: 40 }}
            >
              {this.state.announcements.map((item, i) => {
                return (
                  <div
                    className={classnames(classes.message_node)}
                    key={"announcements" + i}
                  >
                    <span>
                      <Iconfont type="announcement" />
                    </span>
                    <p
                      onClick={() => {
                        item.jump_url &&
                          extension.tabs &&
                          extension.tabs.create({
                            url: item.jump_url,
                          });
                      }}
                    >
                      {item.text}
                    </p>
                    <Iconfont type="close" onClick={this.remove(i)} />
                  </div>
                );
              })}
            </AutoPlaySwipeableViews>
          </div>
        ) : (
          ""
        )}
        <List component="nav">
          {this.state.chains.map((item, i) => {
            let amount = 0;
            let prefix = "";
            let unit = "";
            let token = this.state.tokens.find((it) => it.symbol == item.chain);
            token = token || {};
            this.state.tokens.map((it) => {
              if (it.chain == item.chain && !it.hide) {
                const rate = this.rates(
                  it.amount,
                  it.symbol,
                  this.props.store.unit,
                  this.props.rates
                );
                if (Number(rate[0])) {
                  amount += Number(rate[0]);
                  prefix = rate[2];
                  unit = rate[1];
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
              item.chain,
              this.props.store.unit,
              this.props.rates
            );
            return (
              <ListItem
                key={item.chain}
                button
                className={classes.listItem}
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push({
                      pathname: route_map.chain + "/" + item.chain,
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
                    {(item.chain || "").toUpperCase()}{" "}
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
                    {/* {rates2[2]}
                    {rates2[0]} {rates2[1]} */}
                    {item.full_name}
                  </em>
                </ListItemText>
                <ListItemText style={{ textAlign: "right" }}>
                  <strong style={{ display: "inline" }}></strong>
                  <em>
                    {prefix}
                    {util.fix_digits(amount, 2)}
                    {unit.toUpperCase()}
                  </em>
                </ListItemText>
              </ListItem>
            );
          })}
        </List>

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
        <Dialog
          open={this.state.delete_account}
          onClose={() => {
            this.setState({ delete_account: false });
          }}
        >
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "delete account" })}
          </DialogTitle>
          <DialogContent>
            <p>
              {this.props.intl.formatMessage({ id: "delete account desc" })}
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                this.setState({
                  delete_account: false,
                });
              }}
            >
              {this.props.intl.formatMessage({ id: "cancel" })}
            </Button>
            <Button color="primary" onClick={this.delete_account}>
              {this.props.intl.formatMessage({ id: "confirm" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
