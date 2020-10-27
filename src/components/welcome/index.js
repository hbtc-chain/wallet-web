// layout
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button } from "@material-ui/core";
import route_map from "../../config/route_map";
import { routerRedux } from "dva/router";
import Language from "../public/language";

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
    const { classes, intl, ...otherProps } = this.props;
    return (
      <div className={classes.index}>
        <Language {...otherProps} />
        <img className={classes.logo} src={require("../../assets/logo.png")} />
        <h1>{intl.formatMessage({ id: "hbtc.wallet" })}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({ id: "welcome.desc" }),
          }}
        />
        <Button
          onClick={this.goto}
          color="primary"
          variant="contained"
          fullWidth
        >
          {intl.formatMessage({ id: "welcome.btn.start" })}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
