import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Room,
    Home,
    Login,
    Dashboard,
    Register,
    NotFound,
    Settings
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) replace('/');
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  const requireAnonymous = (nextState, replace) => {
    const {auth: {user}} = store.getState();
    if (user) replace('/');
  };


  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="dashboard" component={Dashboard}/>
        <Route path="settings" component={Settings}/>
      </Route>

       {/* TODO: add requireLogin */}
      <Route path="room/:id" component={Room}/>

      <Route onEnter={requireAnonymous}>
        <Route path="login" component={Login}/>
        <Route path="signup" component={Register}/>
      </Route>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
