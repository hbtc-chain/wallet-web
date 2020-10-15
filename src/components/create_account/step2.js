// create account step 1
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, FormControlLabel, Radio } from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";
import { routerRedux } from "dva/router";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: false,
    };
  }
  goto = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: route_map.create_account_step3,
        search: this.props.location.search,
      })
    );
  };
  radioChange = () => {
    const checked = this.state.checked;
    this.setState({
      checked: !checked,
    });
  };
  render() {
    const { classes, intl } = this.props;
    const params = querystring.parse(window.location.search || "");
    return (
      <div className={classes.step2}>
        <div className={classes.step2_con_bg}>
          <div className={classes.step2_con}>
            <h1>{intl.formatMessage({ id: "create.title2" })}</h1>
            <p>{intl.formatMessage({ id: "statemente.tip" })}</p>
            <ul>
              <li>{intl.formatMessage({ id: "statemente.desc1" })}</li>
              <li>{intl.formatMessage({ id: "statemente.desc2" })}</li>
              <li>{intl.formatMessage({ id: "statemente.desc3" })}</li>
              <li>{intl.formatMessage({ id: "statemente.desc4" })}</li>
            </ul>
          </div>
        </div>
        <div className={classes.agreement}>
          <FormControlLabel
            checked={this.state.checked}
            control={<Radio onClick={this.radioChange} />}
            label={intl.formatMessage({ id: "statemente.agreement" })}
          />
          <Button
            onClick={this.goto}
            color="primary"
            variant="contained"
            fullWidth
            disabled={!this.state.checked}
          >
            {intl.formatMessage({
              id: "confirm",
            })}
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
