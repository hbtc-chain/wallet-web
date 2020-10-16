import React from "react";
import { connect } from "dva";
import LayoutRC from "../components/layout";
import HeaderRC from "../components/header";
import IndexRC from "../components/create_account/step4";
import withRoot from "../withRoot";
import querystring from "query-string";

function IndexPage({ layout, dispatch, location, match }) {
  const params = querystring.parse(location.search || "");
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <HeaderRC
        {...layout}
        dispatch={dispatch}
        location={location}
        match={match}
      />
      <div className="g_content">
        <IndexRC {...layout} dispatch={dispatch} location={location} match />
      </div>
    </LayoutRC>
  );
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
