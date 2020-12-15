import React from "react";
import { Router, Route, Switch, Redirect } from "dva/router";
import dynamic from "dva/dynamic";
import route_map from "./config/route_map";

function RouterConfig({ history, app }) {
  // 404
  const NotFountRC = dynamic({
    app,
    component: () => import("./pages/404"),
  });
  // index
  const IndexRC = dynamic({
    app,
    component: () => import("./pages/index"),
    models: () => [],
  });
  // login
  const LoginRC = dynamic({
    app,
    component: () => import("./pages/login"),
    models: () => [],
  });
  // connect
  const ConnectRC = dynamic({
    app,
    component: () => import("./pages/connect"),
    models: () => [],
  });
  // welcome
  const WelcomeRC = dynamic({
    app,
    component: () => import("./pages/welcome"),
    models: () => [],
  });
  // create accunt step 1
  const CreateAccountStep1RC = dynamic({
    app,
    component: () => import("./pages/create_account_step1"),
  });
  // create accunt step 2
  const CreateAccountStep2RC = dynamic({
    app,
    component: () => import("./pages/create_account_step2"),
  });
  // create account step 3
  const CreateAccountStep3RC = dynamic({
    app,
    component: () => import("./pages/create_account_step3"),
  });
  // create account step 4
  const CreateAccountStep4RC = dynamic({
    app,
    component: () => import("./pages/create_account_step4"),
  });
  //  account seed
  const AccountSeedRC = dynamic({
    app,
    component: () => import("./pages/account_seed"),
  });
  //  account import
  const AccountImportRC = dynamic({
    app,
    component: () => import("./pages/account_import"),
  });
  //  account export list
  const AccountExportListRC = dynamic({
    app,
    component: () => import("./pages/export_list"),
  });
  //  account export
  const AccountExportRC = dynamic({
    app,
    component: () => import("./pages/export"),
  });
  //  account choose
  const AccountChooseRC = dynamic({
    app,
    component: () => import("./pages/account_choose"),
  });
  //  account import list
  const AccountImportListRC = dynamic({
    app,
    component: () => import("./pages/account_import_list"),
  });
  // create account done
  const CreateAccountDoneRC = dynamic({
    app,
    component: () => import("./pages/create_account_done"),
  });
  // sign
  const SignRC = dynamic({
    app,
    component: () => import("./pages/sign"),
  });
  // chain
  const ChainRC = dynamic({
    app,
    component: () => import("./pages/chain"),
  });
  // add token
  const AddTokenRC = dynamic({
    app,
    component: () => import("./pages/add_token"),
  });
  // external address
  const ExternalAddressRC = dynamic({
    app,
    component: () => import("./pages/external_address"),
  });
  // test token
  const TestTokenRC = dynamic({
    app,
    component: () => import("./pages/test_token"),
  });
  // symbol
  const SymbolRC = dynamic({
    app,
    component: () => import("./pages/symbol"),
  });
  // transfer
  const TransferRC = dynamic({
    app,
    component: () => import("./pages/transfer"),
  });
  // send
  const SendRC = dynamic({
    app,
    component: () => import("./pages/send"),
  });
  // withdrawal
  const WithdrawalRC = dynamic({
    app,
    component: () => import("./pages/withdrawal"),
  });
  // accept
  const AcceptRC = dynamic({
    app,
    component: () => import("./pages/accept"),
  });
  // accept by type
  const AccpetByTypeRC = dynamic({
    app,
    component: () => import("./pages/accept_by_type"),
  });
  // setting
  const SettingRC = dynamic({
    app,
    component: () => import("./pages/setting"),
  });
  // delegate
  const DelegateRC = dynamic({
    app,
    component: () => import("./pages/delegate"),
  });
  // delegate node
  const DelegateNodeRC = dynamic({
    app,
    component: () => import("./pages/delegate_node"),
  });
  // delegate exec
  const DelegateExecRC = dynamic({
    app,
    component: () => import("./pages/delegate_exec"),
  });
  // delegate unexec
  const DelegateUnExecRC = dynamic({
    app,
    component: () => import("./pages/delegate_unexec"),
  });

  return (
    <Router history={history}>
      <Switch>
        {/* index */}
        <Route exact path={route_map.index} component={IndexRC} />
        {/* login */}
        <Route exact path={route_map.login} component={LoginRC} />
        {/* connect */}
        <Route exact path={route_map.connect} component={ConnectRC} />
        {/* welcome */}
        <Route exact path={route_map.welcome} component={WelcomeRC} />
        {/* create account step1 */}
        <Route
          exact
          path={route_map.create_account_step1}
          component={CreateAccountStep1RC}
        />
        {/* create account step2 */}
        <Route
          exact
          path={route_map.create_account_step2}
          component={CreateAccountStep2RC}
        />
        {/* create account step3 */}
        <Route
          exact
          path={route_map.create_account_step3}
          component={CreateAccountStep3RC}
        />
        {/* create account step4 */}
        <Route
          exact
          path={route_map.create_account_step4}
          component={CreateAccountStep4RC}
        />
        {/*  account seed */}
        <Route exact path={route_map.account_seed} component={AccountSeedRC} />
        {/*  account import */}
        <Route
          exact
          path={route_map.account_import}
          component={AccountImportRC}
        />
        {/*  account export list */}
        <Route
          exact
          path={route_map.export_list}
          component={AccountExportListRC}
        />
        {/*  account export */}
        <Route exact path={route_map.export} component={AccountExportRC} />
        {/* account choose */}
        <Route
          exact
          path={route_map.account_choose}
          component={AccountChooseRC}
        />
        {/* account import list */}
        <Route
          exact
          path={route_map.account_import_list}
          component={AccountImportListRC}
        />
        {/* create account done */}
        <Route
          exact
          path={route_map.create_account_done}
          component={CreateAccountDoneRC}
        />
        {/* sign */}
        <Route exact path={route_map.sign} component={SignRC} />
        {/* chain */}
        <Route exact path={route_map.chain + "/:chainId"} component={ChainRC} />
        <Redirect exact from={route_map.chain} to={route_map.chain + "/hbc"} />
        {/* AddTokenRC */}
        <Route
          exact
          path={route_map.add_token + "/:chainId"}
          component={AddTokenRC}
        />
        {/* external address */}
        <Route
          exact
          path={route_map.external_address + "/:symbol"}
          component={ExternalAddressRC}
        />
        {/* test token */}
        <Route exact path={route_map.test_token} component={TestTokenRC} />
        {/* symbol */}
        <Route
          exact
          path={route_map.symbol + "/:symbol"}
          component={SymbolRC}
        />
        {/* Transfer */}
        <Route
          exact
          path={route_map.transfer + "/:symbol"}
          component={TransferRC}
        />
        <Route exact path={route_map.send} component={SendRC} />
        {/* withdrawal */}
        <Route
          exact
          path={route_map.withdrawal + "/:symbol"}
          component={WithdrawalRC}
        />
        {/* AcceptRC */}
        <Route exact path={route_map.accept + "/:token"} component={AcceptRC} />
        <Redirect
          exact
          from={route_map.accept}
          to={route_map.accept + "/hbc"}
          component={AcceptRC}
        />
        {/* AccpetByTypeRC */}
        <Route
          exact
          path={route_map.accept_by_type + "/:token"}
          component={AccpetByTypeRC}
        />
        <Redirect
          exact
          from={route_map.accept_by_type}
          to={route_map.accept_by_type + "/hbc"}
          component={AccpetByTypeRC}
        />
        {/* SettingRC */}
        <Route exact path={route_map.setting} component={SettingRC} />
        {/* DelegateRC */}
        <Route exact path={route_map.delegate} component={DelegateRC} />
        {/* DelegateNodeRC */}
        <Route
          exact
          path={route_map.delegate_node + "/:operator_address"}
          component={DelegateNodeRC}
        />
        {/* DelegateExecRC */}
        <Route
          exact
          path={route_map.delegate_exec + "/:operator_address"}
          component={DelegateExecRC}
        />
        {/* DelegateExecRC */}
        <Route
          exact
          path={route_map.delegate_unexec + "/:operator_address"}
          component={DelegateUnExecRC}
        />

        <Route component={NotFountRC} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
