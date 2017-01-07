import React, { Component, PropTypes } from 'react';
import { connect } from "react-redux";
import { actions } from "../reducer";

class AppWrapper extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    onRequestNotes: PropTypes.func.isRequired,
  };

  state = { appHeight: window.innerHeight };

  componentDidMount () {
    this.props.onRequestNotes();

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
})(AppWrapper);
