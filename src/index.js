import React from "react";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import sagas from "./sagas";
import { HashRouter as Router } from "react-router-dom";
import AppWrapper from "./components/AppWrapper";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

FastClick.attach(document.body);

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middleware.push(require("./utils/reduxLogger").default);
}

const store = createStore(reducer, applyMiddleware(...middleware));

sagas.forEach(saga => {
  sagaMiddleware.run(saga);
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <AppWrapper />
    </Router>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
