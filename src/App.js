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

const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagas.forEach(saga => { sagaMiddleware.run(saga); });

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <div>
          <Search />
          <Notes />
          <Editor />
        </div>
      </Provider>
    );
  }
}

export default App;
