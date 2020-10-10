import React from "react";
import { connect } from "dva";
import LayoutRC from "../components/layout";
import IndexRC from "../components/account/sign";
import withRoot from "../withRoot";
import LoginRC from "../components/account/login";

function IndexPage({ layout, dispatch, location }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <div className="g_content">
        {layout.logged ? (
          <IndexRC {...layout} dispatch={dispatch} location={location} />
        ) : (
          <LoginRC {...layout} dispatch={dispatch} location={location} />
        )}
      </div>
    </LayoutRC>
  );
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
