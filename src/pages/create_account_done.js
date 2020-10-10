import React from "react";
import { connect } from "dva";
import LayoutRC from "../components/layout";
import HeaderRC from "../components/header";
import IndexRC from "../components/create_account/complete";
import withRoot from "../withRoot";

function IndexPage({ layout, dispatch, location, match }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <HeaderRC
        {...layout}
        dispatch={dispatch}
        location={location}
        match={match}
      />
      <div className="g_content">
        <IndexRC {...layout} dispatch={dispatch} location={location} />
      </div>
    </LayoutRC>
  );
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
