// create account step 1
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button } from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";
import { routerRedux } from "dva/router";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  goto = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_step3,
        search: this.props.location.search,
      })
    );
  };
  render() {
    const { classes } = this.props;
    const params = querystring.parse(window.location.search || "");
    return (
      <div className={classes.step2}>
        <h1>{this.props.intl.formatMessage({ id: "create.title2" })}</h1>
        <ul>
          <li>{this.props.intl.formatMessage({ id: "statemente.desc1" })}</li>
          <li>{this.props.intl.formatMessage({ id: "statemente.desc2" })}</li>
          <li>{this.props.intl.formatMessage({ id: "statemente.desc3" })}</li>
          <li>{this.props.intl.formatMessage({ id: "statemente.desc4" })}</li>
        </ul>
        <Button onClick={this.goto} color="primary" variant="contained">
          {this.props.intl.formatMessage({
            id: "I agree",
          })}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
