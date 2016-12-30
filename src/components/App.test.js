import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "../reducer";
import App from "./App";
import Home from "./Home";

it('renders without crashing', () => {
  const div = document.createElement("div");
  ReactDOM.render((
    <Provider store={createStore(reducer)}>
      <App>
        <Home />
      </App>
    </Provider>
  ), div);
});
