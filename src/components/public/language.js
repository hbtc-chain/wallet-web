// create account step 1
import React from "react";
import styles from "./language.style.js";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Paper, Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import { routerRedux } from "dva/router";
import { Iconfont } from "../../lib";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  toggleDrawer = (open) => (e) => {
    console.log(open);
    this.setState({
      open,
    });
  };
  changeLang = (lang) => async (e) => {
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        store: {
          ...this.props.store,
          lang,
        },
      },
    });
    this.setState({
      open: false,
    });
    window.location.reload();
  };
  render() {
    const { classes, intl } = this.props;
    return (
      <div>
        <div className={classes.lang} onClick={this.toggleDrawer(true)}>
          {this.props.intl.formatMessage({
            id: this.props.store.lang,
          })}
          <Iconfont type="arrowdown" size={20} />
        </div>
        <Drawer
          anchor="bottom"
          open={this.state.open}
          onClose={this.toggleDrawer(false)}
        >
          <List style={{ height: 200 }}>
            {this.props.langs.map((item) => {
              return (
                <ListItem
                  button
                  className={classes.nested}
                  onClick={this.changeLang(item)}
                  key={item}
                >
                  <ListItemText className={classes.option_item}>
                    {intl.formatMessage({ id: item })}
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
