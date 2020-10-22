// 设置
import React from "react";
import styles from "./export.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import helper from "../../util/helper";
import { routerRedux } from "dva/router";
import querystring from "query-string";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { Iconfont } from "../../lib";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      way: "",
      password: "",
      password_msg: "",
      visibility: false,
    };
  }
  componentDidMount() {}
  openModal = (way) => (e) => {
    this.setState({ open: true, way });
  };
  goto = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.export,
        search: "way=" + this.state.way,
        state: {
          password: this.state.password,
        },
      })
    );
  };
  handleChange = (key) => (e) => {
    this.setState({
      [key]: e.target.value,
      password_msg: "",
    });
  };
  submit = (e) => {
    const store = this.props.store;
    const pwd = store.accounts[store.account_index]["password"];
    if (helper.sha256(this.state.password) === pwd) {
      this.goto();
    } else {
      this.setState({
        password_msg: this.props.intl.formatMessage({
          id: "password is wrong",
        }),
      });
    }
  };
  render() {
    const { classes, intl, dispatch, store } = this.props;
    const mnemonic = store.accounts[store.account_index]["mnemonic"];
    return (
      <div className={classes.export_list}>
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
            <h2>{intl.formatMessage({ id: "export account" })}</h2>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <List>
          {mnemonic ? (
            <ListItem onClick={this.openModal("seed")}>
              <ListItemText
                primary={intl.formatMessage({ id: "seed" })}
              ></ListItemText>
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <NavigateNext />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ) : (
            ""
          )}
          <ListItem onClick={this.openModal("key")}>
            <ListItemText
              primary={intl.formatMessage({ id: "private key" })}
            ></ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <NavigateNext />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem onClick={this.openModal("Keystore")}>
            <ListItemText
              primary={intl.formatMessage({ id: "Keystore" })}
            ></ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <NavigateNext />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Dialog open={this.state.open} classes={{ paper: classes.dialog }}>
          <DialogTitle>
            {intl.formatMessage({ id: "enter password" })}
          </DialogTitle>
          <DialogContent>
            <TextField
              value={this.state.password}
              onChange={this.handleChange("password")}
              helperText={this.state.password_msg}
              error={Boolean(this.state.password_msg)}
              placeholder={intl.formatMessage({ id: "password" })}
              style={{ width: 240 }}
              variant="outlined"
              type={this.state.visibility ? "text" : "password"}
              InputProps={{
                endAdornment: this.state.visibility ? (
                  <Iconfont
                    type="hidden"
                    size={20}
                    onClick={() => {
                      this.setState({
                        visibility: false,
                      });
                    }}
                  />
                ) : (
                  <Iconfont
                    type="unhidden"
                    size={20}
                    onClick={() => {
                      this.setState({
                        visibility: true,
                      });
                    }}
                  />
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                this.setState({ open: false, password: "", password_msg: "" });
              }}
              // style={{ padding: 10 }}
            >
              {intl.formatMessage({ id: "cancel" })}
            </Button>
            <Button
              onClick={this.submit}
              variant="contained"
              color="primary"
              fullWidth
              disabled={!this.state.password}
              // style={{ padding: 10 }}
            >
              {intl.formatMessage({ id: "confirm" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
