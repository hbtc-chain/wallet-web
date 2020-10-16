import React from "react";
import { connect } from "dva";
import { Redirect } from "dva/router";
import route_map from "../config/route_map";

function IndexPage({ layout, dispatch, location }) {
  const accounts = layout.store.accounts;
  if (accounts.length) {
    return <Redirect to={route_map.index} />;
  }
  return <Redirect to={route_map.welcome} />;
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default connect(mapStateToProps)(IndexPage);
