import React, { Component } from 'react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducer.js";
import Search from "./components/Search.js";
import Notes from "./components/Notes.js";
import './App.css';

const store = createStore(reducer);

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <div>
          <Search />
          <Notes />
        </div>
      </Provider>
    );
  }
}

export default App;
