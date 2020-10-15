import React from "react";
import { connect } from "dva";
import LayoutRC from "../components/layout";
import HeaderRC from "../components/header";
import IndexRC from "../components/create_account/step3_new";
import ImportRC from "../components/create_account/step3_import";
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
        {params.type == "create" ? (
          <IndexRC
            {...layout}
            dispatch={dispatch}
            location={location}
            match
            // location
          />
        ) : (
          <ImportRC
            {...layout}
            dispatch={dispatch}
            location={location}
            match
            // location
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
