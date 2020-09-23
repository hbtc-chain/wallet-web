// create account success
import React from "react";
import { routerRedux } from "dva/router";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button } from "@material-ui/core";
import route_map from "../../config/route_map";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  goto = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.index,
      })
    );
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.step_done}>
        <div className={classes.emoji}>🎉</div>
        <h1>{this.props.intl.formatMessage({ id: "congratulations" })}</h1>
        <p>{this.props.intl.formatMessage({ id: "create.done.desc" })}</p>
        <h4>{this.props.intl.formatMessage({ id: "safe.tip" })}</h4>
        <ul>
          <li>{this.props.intl.formatMessage({ id: "safe.tip.1" })}</li>
          <li>{this.props.intl.formatMessage({ id: "safe.tip.2" })}</li>
          <li>{this.props.intl.formatMessage({ id: "safe.tip.3" })}</li>
          <li>{this.props.intl.formatMessage({ id: "safe.tip.4" })}</li>
          <li>{this.props.intl.formatMessage({ id: "safe.tip.5" })}</li>
        </ul>
        <p>
          {this.props.intl.formatMessage({ id: "create.done.desc2" })}
          <a href="" target="_blank">
            {this.props.intl.formatMessage({ id: "knowmore" })}
          </a>
        </p>
        <br />
        <Button
          onClick={this.goto}
          color="primary"
          variant="contained"
          className={classes.btn_large}
        >
          {this.props.intl.formatMessage({
            id: "done",
          })}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
