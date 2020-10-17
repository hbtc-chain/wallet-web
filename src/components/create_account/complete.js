// create account success
import React from "react";
import { routerRedux } from "dva/router";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button } from "@material-ui/core";
import route_map from "../../config/route_map";
import Nav from "./nav";
import querystring from "query-string";

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
    const params = querystring.parse(this.props.location.search || "");
    return [
      <Nav
        key="nav"
        title={intl.formatMessage({
          id:
            params.type == "create"
              ? "create.step1.btn.create"
              : "create.step1.btn.import",
        })}
        {...otherProps}
      />,
      <div className={classes.step_done} key="content">
        <img src={require("../../assets/success.png")} />
        <h2>
          {intl.formatMessage({
            id:
              params.type == "create" ? "create.done.desc" : "import.done.desc",
          })}
        </h2>
        {params.type == "create" ? (
          <div className={classes.tip}>
            <h4>{intl.formatMessage({ id: "create.done.tip" })}</h4>
            <ul>
              <li>{intl.formatMessage({ id: "create.done.tip.1" })}</li>
              <li>{intl.formatMessage({ id: "create.done.tip.2" })}</li>
              <li>{intl.formatMessage({ id: "create.done.tip.3" })}</li>
            </ul>
          </div>
        ) : (
          ""
        )}
        <Button
          onClick={this.goto}
          color="primary"
          variant="contained"
          className={classes.button}
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
