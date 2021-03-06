// create account step 1
import React from "react";
import styles from "./index.style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, FormControlLabel, Radio } from "@material-ui/core";
import route_map from "../../config/route_map";
import querystring from "query-string";
import { routerRedux } from "dva/router";
import helper from "../../util/helper";

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
        search: "type=create",
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
    return (
      <div className={classes.step2}>
        {/* <div className={classes.step2_con_bg}> */}
        <div className={classes.step2_con}>
          <h1>{intl.formatMessage({ id: "create.title2" })}</h1>
          <p>{intl.formatMessage({ id: "statemente.tip" })}</p>
          <ul>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc1",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc2",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc3",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc4",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc5",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc6",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc7",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc8",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc9",
                }),
              }}
            ></li>
            <li
              dangerouslySetInnerHTML={{
                __html: this.props.intl.formatMessage({
                  id: "statemente.desc10",
                }),
              }}
            ></li>
          </ul>
        </div>
        {/* </div> */}
        <div className={classes.footer}>
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
            className={classes.button}
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
