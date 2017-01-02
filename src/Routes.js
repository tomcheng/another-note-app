import React from "react";
import { hashHistory, Router, Route, IndexRoute } from "react-router";
import AppWrapper from './components/AppWrapper';
import Home from "./components/Home";
import Show from "./components/Show";
import Edit from "./components/Edit";

const Routes = () => (
  <Router history={hashHistory}>
    <Route path="/" component={AppWrapper}>
      <Route component={Home}>
        <IndexRoute component={null} />
        <Route path=":id" component={Show} />
        <Route path=":id/edit" component={Edit} />
      </Route>
    </Route>
  </Router>
);

export default Routes;
