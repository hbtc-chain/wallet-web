// layout
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button } from "@material-ui/core";
import route_map from "../../config/route_map";
import { routerRedux } from "dva/router";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  goto = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_step1,
      })
    );
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.index}>
        <img src={require("../../assets/logo.png")} />
        <h1>{this.props.intl.formatMessage({ id: "welcome.title" })}</h1>
        <p>{this.props.intl.formatMessage({ id: "welcome.desc" })}</p>
        <Button onClick={this.goto} color="primary" variant="contained">
          {this.props.intl.formatMessage({ id: "welcome.btn.start" })}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
