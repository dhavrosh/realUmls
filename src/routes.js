import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Chat,
    Home,
    /* Widgets,
    About, */
    Login,
    Dashboard,
    Register,
    /* Survey, */
    NotFound,
    /* Pagination, */
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

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="dashboard" component={Dashboard}/>
      </Route>

      <Route path="chat/:id" component={Chat}/>

      <Route onEnter={requireAnonymous}>
        <Route path="login" component={Login}/>
        <Route path="signup" component={Register}/>
      </Route>

      { /* Routes */ }
      {/* <Route path="about" component={About}/> */}
      {/* <Route path="pagination" component={Pagination}/>
      <Route path="survey" component={Survey}/>
      <Route path="widgets" component={Widgets}/> */}

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
