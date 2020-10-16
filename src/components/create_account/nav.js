// nav
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import { routerRedux } from "dva/router";

class NavRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  goback = () => {
    if (this.props.onClick) {
      this.props.onClick();
    } else {
      this.props.dispatch(routerRedux.goBack());
    }
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.nav}>
        <ArrowBackIos onClick={this.goback} />
        {this.props.title}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(NavRC));
