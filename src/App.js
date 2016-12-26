import React, { Component } from 'react';
import Search from "./components/Search";
import Notes from "./components/Notes";
import Preview from "./components/Preview";
import './App.css';

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
        <Notes containerStyle={{ flexShrink: 0 }} />
        <Preview containerStyle={{ flexGrow: 1 }} />
      </div>
    );
  }
}

export default App;
