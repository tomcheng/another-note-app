import React, { Component, PropTypes } from 'react';
import { connect } from "react-redux";
import { actions } from "../reducer";
import Match from "react-router/Match";
import Home from "./Home";
import Show from "./Show";
import Edit from "./Edit";

class AppWrapper extends Component {
  static propTypes = {
    onRequestNotes: PropTypes.func.isRequired,
  };

  state = { appHeight: window.innerHeight };

  componentDidMount () {
    this.props.onRequestNotes();

    window.addEventListener("resize", () => {
      this.setState({ appHeight: window.innerHeight });
    });
  };

  render () {
    const { appHeight } = this.state;

    return (
      <div style={{
        height: appHeight,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* header goes here */}
        <div style={{
          flexShrink: 1,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          <Match exactly pattern="/" component={Home} />
          <Match exactly pattern="/:id" component={Show} />
          <Match exactly pattern="/:id/edit" component={Edit} />
        </div>
      </div>
    );
  }
}

export default connect(null, {
  onRequestNotes: actions.requestNotes,
})(AppWrapper);
