import React, { PropTypes, Component } from "react";
import { animate } from "../utils/animation";

class AnimateHeight extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    delay: PropTypes.number,
    duration: PropTypes.number,
  };

  static defaultProps = {
    delay: 0,
    duration: 150,
  };

  state = {
    isAnimating: false,
    containerHeight: 0,
  };

  componentWillReceiveProps (nextProps) {
    const { isExpanded, duration, delay } = this.props;

    if (!isExpanded && nextProps.isExpanded) {
      this.stopAnimation();
      this.timer = setTimeout(() => {
        this.animation = animate({
          start: 0,
          end: this.contentWrapper.offsetHeight,
          duration: duration,
          onUpdate: ht => this.setState({ containerHeight: ht }),
          onComplete: () => this.setState({ isAnimating: false }),
        });
      }, delay);
      this.setState({
        isAnimating: true,
        containerHeight: 0,
      });
    }

    if (isExpanded && !nextProps.isExpanded) {
      this.stopAnimation();
      this.timer = setTimeout(() => {
        this.animation = animate({
          start: this.contentWrapper.offsetHeight,
          end: 0,
          duration: duration,
          onUpdate: ht => this.setState({ containerHeight: ht }),
          onComplete: () => this.setState({ isAnimating: false }),
        });
      }, delay);
      this.setState({
        isAnimating: true,
        containerHeight: this.contentWrapper.offsetHeight,
      });
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timer);
    this.stopAnimation();
  }

  stopAnimation = () => {
    if (this.animation) { this.animation.stop(); }
  };

  render () {
    const { children, isExpanded } = this.props;
    const { containerHeight, isAnimating } = this.state;

    return (
      <div style={{
        height: isAnimating ? containerHeight : (isExpanded ? "auto" : 0),
        overflow: isAnimating ? "hidden" : "visible",
      }}>
        <div
          ref={el => { this.contentWrapper = el; }}
          style={{
            display: !isAnimating && !isExpanded ? "none" : "block",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default AnimateHeight;
