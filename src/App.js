import React, { Component } from 'react';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import sagas from "./sagas";
import Search from "./components/Search";
import Notes from "./components/Notes";
import Editor from "./components/Editor";
import './App.css';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middleware.push(require("./utils/reduxLogger").default);
}

const store = createStore(reducer, applyMiddleware(...middleware));

sagas.forEach(saga => { sagaMiddleware.run(saga); });

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <div className="AppContainer">
          <Search />
          <Notes />
          <Editor />
        </div>
      </Provider>
    );
  }
}

export default App;
