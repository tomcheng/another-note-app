import React, { Component } from 'react';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import sagas from "./sagas";
import Search from "./components/Search";
import Notes from "./components/Notes";
import Preview from "./components/Preview";
import './App.css';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middleware.push(require("./utils/reduxLogger").default);
}

const store = createStore(reducer, applyMiddleware(...middleware));

sagas.forEach(saga => { sagaMiddleware.run(saga); });

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      appHeight: window.innerHeight,
    };
  }
  componentDidMount () {
    window.addEventListener("resize", () => {
      this.setState({ appHeight: window.innerHeight });
    })
  };

  render () {
    const { appHeight } = this.state;

    return (
      <Provider store={store}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            height: appHeight,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <Search />
          </div>
          <Notes containerStyle={{ flexShrink: 0, flexBasis: "180px", flexGrow: 1, overflow: "auto" }} />
          <Preview containerStyle={{ flexShrink: 1 }} />
        </div>
      </Provider>
    );
  }
}

export default App;
