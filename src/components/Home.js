import React, { PropTypes, Component } from "react";
import CSSTransition from "react-addons-css-transition-group";
import Search from "./Search";
import Notes from "./Notes";
import "./Home.css";

class Home extends Component {
  static propTypes = {
    children: PropTypes.element,
  };

  render () {
    const { children } = this.props;

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}>
        <div style={{
          flexShrink: 0,
          opacity: children ? 0 : 1,
          transition: "opacity 0.15s ease",
        }}>
          <Search />
        </div>
        <div style={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          opacity: children ? 0 : 1,
          transition: "opacity 0.15s ease",
        }}>
          <Notes />
        </div>
        <CSSTransition
          transitionName="showContainer"
          transitionLeave={false}
          transitionEnterTimeout={600}
        >
          {children && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}>
              {children}
            </div>
          )}
        </CSSTransition>
      </div>
    );
  }
}

export default Home;
