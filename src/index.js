import React from "react";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import sagas from "./sagas";
import HashRouter from "react-router/HashRouter";
import AppWrapper from "./components/AppWrapper";
import "./index.css";

const host = "notorist.com";
if (window.location.host === host && window.location.protocol !== "https:") {
  window.location.protocol = "https:"
}

FastClick.attach(document.body);

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middleware.push(require("./utils/reduxLogger").default);
}

const store = createStore(reducer, applyMiddleware(...middleware));

sagas.forEach(saga => { sagaMiddleware.run(saga); });

ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <AppWrapper />
    </HashRouter>
  </Provider>
), document.getElementById("root"));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(function (registration) {
    console.log("ServiceWorker registration successful with scope.", registration.scope);
  }).catch(function (error) {
    console.log("ServiceWorker registration failed.", error);
  });
}
