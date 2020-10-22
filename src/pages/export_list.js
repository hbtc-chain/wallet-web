import React from "react";
import { connect } from "dva";
import LayoutRC from "../components/layout";
import IndexRC from "../components/account/export_list";
import LoginRC from "../components/account/login";
import withRoot from "../withRoot";

function IndexPage({ layout, dispatch, location, history }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <div className="g_content">
        {/* {layout.logged ? ( */}
        <IndexRC
          {...layout}
          dispatch={dispatch}
          location={location}
          history={history}
        />
        {/* ) : (
          <LoginRC
            {...layout}
            dispatch={dispatch}
            location={location}
            history={history}
          />
        )} */}
      </div>
    </LayoutRC>
  );
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
