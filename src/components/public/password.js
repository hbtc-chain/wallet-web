// 转账
import React from "react";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Button,
  TextField,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControlLabel,
} from "@material-ui/core";
import helper from "../../util/helper";
import CONST from "../../util/const";
// import PWDRC from "./pwd_input";
import { Iconfont } from "../../lib";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password_msg: "",
      no_pwd: false,
    };
  }
  componentDidMount() {
    this.setState({
      no_pwd: this.props.no_pwd,
    });
  }
  componentDidUpdate(preProps) {
    // 密码有效期内
    if (this.props.logged && this.props.password && this.props.open) {
      this.props.submit && this.props.submit({ password: this.props.password });
      return;
    }
  }
  savepwd = (e) => {
    this.setState({
      no_pwd: e.target.checked,
    });
  };
  handleChange = (key) => (e) => {
    this.setState(
      {
        [key]: e.target.value,
        [key + "_msg"]: "",
      },
      () => {
        if (this.state.password.length == 6) {
          this.success();
        }
      }
    );
  };
  cancel = () => {
    this.setState({
      password: "",
      password_msg: "",
    });
    this.props.cancel && this.props.cancel();
  };
  success = async () => {
    if (!this.state.password) {
      this.setState({
        password_msg: this.props.intl.formatMessage({
          id: "password is required",
        }),
      });
      return;
    }
    let pwd = helper.sha256(this.state.password);
    if (
      pwd !=
      this.props.store.accounts[this.props.store.account_index]["password"]
    ) {
      this.setState({
        password_msg: this.props.intl.formatMessage({
          id: "password is wrong",
        }),
      });
      return;
    }
    // 保存免密配置
    // this.props.messageManager.sendMessage({
    //   type: CONST.METHOD_SAVE_PASSWORD,
    //   data: {
    //     no_pwd: this.state.no_pwd,
    //     password: this.state.password,
    //   },
    // });
    this.props.submit && this.props.submit({ password: this.state.password });
    this.setState({
      password_msg: "",
      password: "",
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Dialog open={this.props.open}>
        <DialogTitle className={classes.title}>
          <em>{this.props.intl.formatMessage({ id: "confirmed password" })}</em>
          <Iconfont type="close" size={20} onClick={this.cancel} />
        </DialogTitle>
        <DialogContent>
          <p className={classes.mark_info}>{this.props.mark_info}</p>
          {/* <PWDRC
            autoFocus={this.props.autoFocus}
            onChange={this.handleChange("password")}
          />
          <p className={classes.error_msg}>{this.state.password_msg}</p> */}
          <TextField
            value={this.state.password}
            onChange={this.handleChange("password")}
            helperText={this.state.password_msg}
            error={Boolean(this.state.password_msg)}
            label={this.props.intl.formatMessage({
              id: "password is required",
            })}
            style={{ width: 260 }}
            variant="outlined"
            type="password"
          />

          {/* <div>
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  color="primary"
                  onChange={this.savepwd}
                  checked={this.state.no_pwd ? "checked" : false}
                />
              }
              label={this.props.intl.formatMessage({
                id: "no need password in 30m",
              })}
            />
          </div> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.success}
            variant="contained"
            color="primary"
            fullWidth
            style={{ padding: 10 }}
          >
            {this.props.intl.formatMessage({ id: "confirm" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
