import React from "react";
import { hashHistory, Router, Route, IndexRoute } from "react-router";
import AppWrapper from './components/AppWrapper';
import Home from "./components/Home";
import Show from "./components/Show";
import Edit from "./components/Edit";

const Routes = () => (
  <Router history={hashHistory}>
    <Route path="/" component={AppWrapper}>
      <IndexRoute component={Home} />
      <Route path=":id" component={Show} />
      <Route path=":id/edit" component={Edit} />
    </Route>
  </Router>
);

export default Routes;
