import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

// const Home = lazy(() => import('./home/Home'));
const Post = lazy(() => import('./posts/Post'));
const Login = lazy(() => import('./user-pages/Login'));
const Members = lazy(() => import('./pages/Members'));
const Benefits = lazy(() => import('./pages/Benefits'));
const Events = lazy(() => import('./pages/Events'));
const QA = lazy(() => import('./pages/qa'));
const Settings = lazy(() => import('../app/shared/Settings'));

class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          {/* <Route path="/home" component={ Home } /> */}
          <Route path="/post" component={ Post } />
          <Route path="/login" component={ Login } />
          <Route path="/members" component={ Members } />
          <Route path="/benefits" component={ Benefits } />
          <Route path="/events" component={ Events } />
          <Route path="/qa" component={ QA } />
          <Route path="/settings" component={ Settings } />
          <Redirect from="/" to="/login" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;