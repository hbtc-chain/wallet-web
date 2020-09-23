import React from "react";
import { connect } from "dva";
import LayoutRC from "../components/layout";
import HeaderRC from "../components/header";
import IndexRC from "../components/create_account/step2";
import withRoot from "../withRoot";

function IndexPage({ layout, dispatch, location, match }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <HeaderRC
        {...layout}
        dispatch={dispatch}
        location={location}
        match
        location
      />
      <div className="g_content">
        <IndexRC
          {...layout}
          dispatch={dispatch}
          location={location}
          match={match}
        />
      </div>
    </LayoutRC>
  );
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
