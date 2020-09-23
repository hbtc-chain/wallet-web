import React from "react";
import { connect } from "dva";
import LayoutRC from "../components/layout";
import IndexRC from "../components/welcome/index";
import withRoot from "../withRoot";

function IndexPage({ layout, dispatch, location }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
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
