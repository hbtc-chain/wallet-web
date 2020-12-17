// 数字密码输入框
import React from "react";
import styles from "./pwd_input.style.js";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { TextField, Grid } from "@material-ui/core";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.ref = [];
    this.state = {
      pwd: "",
    };
  }
  componentDidMount() {}
  change = (e) => {
    let d = e.target.value.replace(/[^\d]/g, "");
    if (d.length > 6) {
      return;
    }
    this.setState({
      pwd: d,
    });
    this.props.onChange && this.props.onChange(e);
  };
  render() {
    const { classes, intl } = this.props;
    return (
      <div className={classes.container}>
        <Grid container justify="space-between" className={classes.inputs}>
          {[0, 1, 2, 3, 4, 5].map((item) => {
            return (
              <Grid
                item
                className={
                  (this.state.pwd == "" && this.state.focus && item == 0) ||
                  (this.state.pwd.length > 0 &&
                    this.state.focus &&
                    this.state.pwd.length == item) ||
                  (this.state.pwd.length == 6 && this.state.focus && item == 5)
                    ? "active"
                    : ""
                }
              >
                {this.state.pwd == "" && this.state.focus && item == 0 ? (
                  <span>|</span>
                ) : (
                  ""
                )}
                {this.state.pwd.length > 0 &&
                this.state.focus &&
                this.state.pwd.length == item ? (
                  <span>|</span>
                ) : (
                  ""
                )}
                {(this.state.pwd.length > 0 && this.state.pwd.length > item) ||
                (this.state.pwd.length == 6 &&
                  this.state.focus &&
                  item == 5) ? (
                  <i></i>
                ) : (
                  ""
                )}
              </Grid>
            );
          })}
        </Grid>
        <TextField
          fullWidth
          autoFocus={
            this.props.autoFocus !== undefined ? this.props.autoFocus : true
          }
          ref={(ref) => (this.ref = ref)}
          onFocus={() => {
            this.setState({ focus: true });
          }}
          onBlur={() => {
            this.setState({ focus: false });
          }}
          value={this.state.pwd}
          onChange={this.change}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
