import PropTypes from "prop-types";
import React, { Component } from "react";
import { animate, easings } from "../utils/animation";

class AnimateHeight extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    delay: PropTypes.number,
    duration: PropTypes.number,
    easing: PropTypes.string,
    fadeFirst: PropTypes.bool
  };

  static defaultProps = {
    delay: 0,
    duration: 150,
    easing: "easeInOutCubic"
  };

  state = {
    isAnimating: false,
    containerHeight: 0
  };

  componentWillReceiveProps(nextProps) {
    const { isExpanded, duration, delay, easing } = this.props;

    if (!isExpanded && nextProps.isExpanded) {
      this.stopAnimation();
      this.timer = setTimeout(() => {
        this.animation = animate({
          start: 0,
          end: this.contentWrapper.offsetHeight,
          duration: duration,
          easing: easings[easing],
          onUpdate: ht => this.setState({ containerHeight: ht }),
          onComplete: () => this.setState({ isAnimating: false })
        });
      }, delay);
      this.setState({
        isAnimating: true,
        containerHeight: 0
      });
    }

    if (isExpanded && !nextProps.isExpanded) {
      const initialHeight = this.contentWrapper.offsetHeight;
      this.stopAnimation();
      this.timer = setTimeout(() => {
        this.animation = animate({
          start: initialHeight,
          end: 0,
          duration: duration,
          easing: easings[easing],
          onUpdate: ht => this.setState({ containerHeight: ht }),
          onComplete: () => this.setState({ isAnimating: false })
        });
      }, delay);
      this.setState({
        isAnimating: true,
        containerHeight: initialHeight
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.stopAnimation();
  }

  stopAnimation = () => {
    if (this.animation) {
      this.animation.stop();
    }
  };

  render() {
    const { children, isExpanded, fadeFirst } = this.props;
    const { containerHeight, isAnimating } = this.state;

    return (
      <div
        style={{
          height: isAnimating ? containerHeight : isExpanded ? "auto" : 0,
          overflow: isAnimating ? "hidden" : "visible",
          opacity: fadeFirst ? (isExpanded && !isAnimating ? 1 : 0) : null,
          transition: "opacity 20ms ease-in-out"
        }}
      >
        <div
          ref={el => {
            this.contentWrapper = el;
          }}
          style={{
            display: !isAnimating && !isExpanded ? "none" : "block"
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default AnimateHeight;
