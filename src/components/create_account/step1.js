// create account step 1
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button } from "@material-ui/core";
import route_map from "../../config/route_map";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import AddIcon from "@material-ui/icons/Add";
import { routerRedux } from "dva/router";
import { Iconfont } from "../../lib";
import Language from "../public/language";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    if (this.props.store.account_index > -1) {
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.index,
        })
      );
    }
  }
  goto = (key) => (e) => {
    if (key == "create") {
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.create_account_step2,
        })
      );
    } else {
      this.props.dispatch(
        routerRedux.push({
          pathname: route_map.create_account_step4,
        })
      );
    }
  };
  render() {
    const { classes, intl, ...otherProps } = this.props;
    return (
      <div className={classes.index}>
        <Language {...otherProps} />
        <img className={classes.logo} src={require("../../assets/logo.png")} />
        <h1>{intl.formatMessage({ id: "create.title" })}</h1>
        <Button
          fullWidth
          onClick={this.goto("create")}
          color="primary"
          variant="contained"
          className={classes.button}
        >
          {intl.formatMessage({
            id: "create.step1.btn.create",
          })}
        </Button>
        <Button
          fullWidth
          onClick={this.goto("import")}
          color="primary"
          variant="outlined"
          className={classes.button}
        >
          {intl.formatMessage({
            id: "create.step1.btn.import",
          })}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
