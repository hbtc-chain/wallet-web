// create account step 1
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Grid, Paper } from "@material-ui/core";
import route_map from "../../config/route_map";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import AddIcon from "@material-ui/icons/Add";
import { routerRedux } from "dva/router";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  goto = (key) => (e) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_step2,
        search: "type=" + key,
      })
    );
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.index}>
        <h1>{this.props.intl.formatMessage({ id: "create.title" })}</h1>
        <Grid container justify="space-between" style={{ minWidth: 700 }}>
          <Grid item>
            <Paper variant="outlined" className={classes.paper}>
              <VerticalAlignBottomIcon fontSize="large" />
              <h2>
                {this.props.intl.formatMessage({
                  id: "create.step1.desc.1",
                })}
              </h2>
              <p>
                {this.props.intl.formatMessage({
                  id: "create.step1.desc.2",
                })}
              </p>
              <Button
                onClick={this.goto("import")}
                color="primary"
                variant="contained"
              >
                {this.props.intl.formatMessage({
                  id: "create.step1.btn.import",
                })}
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper variant="outlined" className={classes.paper}>
              <AddIcon fontSize="large" />
              <h2>
                {this.props.intl.formatMessage({
                  id: "create.step1.desc.3",
                })}
              </h2>
              <p>
                {this.props.intl.formatMessage({
                  id: "create.step1.desc.4",
                })}
              </p>
              <Button
                onClick={this.goto("create")}
                color="primary"
                variant="contained"
              >
                {this.props.intl.formatMessage({
                  id: "create.step1.btn.create",
                })}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
