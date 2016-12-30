import React, { Component, PropTypes } from 'react';
import { connect } from "react-redux";
import { actions } from "../reducer";

class App extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    onRequestNotes: PropTypes.func.isRequired,
    onRequestUISettings: PropTypes.func.isRequired,
  };

  state = { appHeight: window.innerHeight };

  componentDidMount () {
    this.props.onRequestNotes();
    this.props.onRequestUISettings();

    window.addEventListener("resize", () => {
      this.setState({ appHeight: window.innerHeight });
    })
  };

  render () {
    const { children } = this.props;
    const { appHeight } = this.state;

    return (
      <div style={{ height: appHeight }}>
        {children}
      </div>
    );
  }
}

export default connect(null, {
  onRequestNotes: actions.requestNotes,
  onRequestUISettings: actions.requestUISettings,
})(App);
