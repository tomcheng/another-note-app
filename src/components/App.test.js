import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "../reducer";
import AppWrapper from "./AppWrapper";
import Home from "./Home";

it('renders without crashing', () => {
  const div = document.createElement("div");
  ReactDOM.render((
    <Provider store={createStore(reducer)}>
      <AppWrapper>
        <Home />
      </AppWrapper>
    </Provider>
  ), div);
});
