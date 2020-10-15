// create account success
import React from "react";
import { routerRedux } from "dva/router";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button } from "@material-ui/core";
import route_map from "../../config/route_map";
import Nav from "./nav";

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
    const { classes, intl, ...otherProps } = this.props;
    return [
      <Nav
        key="nav"
        title={intl.formatMessage({ id: "create.step1.btn.create" })}
        url={route_map.create_account_step3}
        {...otherProps}
      />,
      <div className={classes.step_done} key="content">
        <img src={require("../../assets/success.png")} />
        <h2>{intl.formatMessage({ id: "create.done.desc" })}</h2>
        <div className={classes.tip}>
          <h4>{intl.formatMessage({ id: "create.done.tip" })}</h4>
          <ul>
            <li>{intl.formatMessage({ id: "create.done.tip.1" })}</li>
            <li>{intl.formatMessage({ id: "create.done.tip.2" })}</li>
            <li>{intl.formatMessage({ id: "create.done.tip.3" })}</li>
          </ul>
        </div>
        <Button
          onClick={this.goto}
          color="primary"
          variant="contained"
          fullWidth
        >
          {intl.formatMessage({
            id: "determine",
          })}
        </Button>
      </div>,
    ];
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
