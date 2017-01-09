import React, { Component, PropTypes } from 'react';
import { connect } from "react-redux";
import { actions } from "../reducer";
import Match from "react-router/Match";
import AnimateHeight from "./AnimateHeight";
import Search from "./Search";
import ShowHeader from "./ShowHeader";
import Home from "./Home";
import Show from "./Show";
import Edit from "./Edit";

const AnimateHeightMatch = ({ component: Component, ...other }) => (
  <Match {...other} children={({ matched, ...otherMatchProps }) => (
    <AnimateHeight isExpanded={matched} duration={100} easing="linear">
      <Component {...otherMatchProps} />
    </AnimateHeight>
  )} />
);

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
        <div style={{
          flexShrink: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.2)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}>
          <AnimateHeightMatch exactly pattern="/" component={Search} />
          <AnimateHeightMatch exactly pattern="/:id" component={ShowHeader} />
        </div>
        <div style={{
          flexShrink: 1,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          <Match exactly pattern="/" children={({ matched }) => (
            <Home isVisible={matched} />
          )} />
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
