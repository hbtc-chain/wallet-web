import React from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import LayoutRC from "../components/layout";
import HeaderRC from "../components/header";
import IndexRC from "../components/create_account/account_import";
import withRoot from "../withRoot";
import route_map from "../config/route_map";
import LoginRC from "../components/account/login";
import querystring from "query-string";

function IndexPage({ layout, dispatch, location, match }) {
  const params = querystring.parse(location.search || "");
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      {/* <HeaderRC
        {...layout}
        dispatch={dispatch}
        location={location}
        match
        location
      /> */}
      <div className="g_content">
        {layout.logged ? (
          <IndexRC
            {...layout}
            dispatch={dispatch}
            location={location}
            match={match}
          />
        ) : (
          <LoginRC
            {...layout}
            dispatch={dispatch}
            location={location}
            match={match}
          />
        )}
      </div>
    </LayoutRC>
  );
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
