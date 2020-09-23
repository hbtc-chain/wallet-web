import React from "react";
import { connect } from "dva";
import LayoutRC from "../components/layout";
import IndexRC from "../components/account/connect";
import LoginRC from "../components/account/login";
import HeaderRC from "../components/header";
import withRoot from "../withRoot";
import route_map from "../config/route_map";
import { routerRedux } from "dva/router";

function IndexPage({ layout, dispatch, location, history }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <div className="g_content">
        {layout.store.password ? (
          <IndexRC
            {...layout}
            dispatch={dispatch}
            location={location}
            history={history}
          />
        ) : (
          <LoginRC
            {...layout}
            dispatch={dispatch}
            location={location}
            history={history}
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
