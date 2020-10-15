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
  //  account seed
  const AccountSeedRC = dynamic({
    app,
    component: () => import("./pages/account_seed"),
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
  // external address
  const ExternalAddressRC = dynamic({
    app,
    component: () => import("./pages/external_address"),
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
  // keystore
  const KeystoreRC = dynamic({
    app,
    component: () => import("./pages/keystore"),
  });
  // accept
  const AcceptRC = dynamic({
    app,
    component: () => import("./pages/accept"),
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
        {/*  account seed */}
        <Route exact path={route_map.account_seed} component={AccountSeedRC} />
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
        {/* external address */}
        <Route
          exact
          path={route_map.external_address + "/:symbol"}
          component={ExternalAddressRC}
        />
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
        {/* KeystoreRC */}
        <Route exact path={route_map.keystore} component={KeystoreRC} />
        {/* AcceptRC */}
        <Route exact path={route_map.accept} component={AcceptRC} />

        <Route component={NotFountRC} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
