import React, { Component } from "react";
import { render, unmountComponentAtNode } from "react-dom";

const renderOutside = Target => class extends Component {
  componentDidMount () {
    this.renderOverlay();
  }

  componentDidUpdate () {
    this.renderOverlay();
  }

  componentWillUnmount () {
    unmountComponentAtNode(this.overlayTarget);

    if (this.overlayTarget) {
      document.body.removeChild(this.overlayTarget);
      this.overlayTarget = null;
    }
  }

  renderOverlay = () => {
    if (!this.overlayTarget) {
      this.overlayTarget = document.createElement("div");
      document.body.appendChild(this.overlayTarget);
    }

    render(<Target {...this.props} />, this.overlayTarget);
  };

  render () {
    return <noscript />;
  }
};

export default renderOutside;
