import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "../reducer";
import App from "./App";

it('renders without crashing', () => {
  const div = document.createElement("div");
  ReactDOM.render((
    <Provider store={createStore(reducer)}>
      <App />
    </Provider>
  ), div);
});
