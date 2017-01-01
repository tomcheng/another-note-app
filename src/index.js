import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import reducer from "./reducer";
import sagas from "./sagas";
import App from './components/App';
import Home from "./components/Home";
import Single from "./components/Single";
import Edit from "./components/Edit";
import "./index.css";

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middleware.push(require("./utils/reduxLogger").default);
}

const store = createStore(reducer, applyMiddleware(...middleware));

sagas.forEach(saga => { sagaMiddleware.run(saga); });

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path=":id" component={Single} />
        <Route path=":id/edit" component={Edit} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));
