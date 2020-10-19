// layout
import React from "react";
import styles from "./layout.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import API from "../util/api";
import util from "../util/util";

class LayoutRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.g_headerBox}>
        <div className={classes.g_contentbox}>{this.props.children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(LayoutRC));
