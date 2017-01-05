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
      <div style={{ height: "100%" }}>
        <CSSTransition
          transitionName="homeContainer"
          transitionEnterTimeout={600}
          transitionLeaveTimeout={600}
        >
          {!children && (
            <div style={{
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ flexShrink: 0 }}>
                <Search />
              </div>
              <div style={{
                position: "relative",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}>
                <Notes />
              </div>
            </div>
          )}
        </CSSTransition>
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
