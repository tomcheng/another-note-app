import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { Route, withRouter } from "react-router-dom";
import AnimateHeight from "./AnimateHeight";
import Search from "./Search";
import ShowHeader from "./ShowHeader";
import Notes from "./Notes";
import Show from "./Show";
import Edit from "./Edit";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const StyledBody = styled.div`
  overflow: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const AnimateHeightMatch = ({ component: Component, ...other }) =>
  <Route
    {...other}
    children={({ match }) =>
      <AnimateHeight
        isExpanded={!!match}
        duration={100}
        easing="linear"
        fadeFirst
      >
        <Component />
      </AnimateHeight>}
  />;

class App extends Component {
  static propTypes = {
    onRequestNotes: PropTypes.func.isRequired
  };

  state = { appHeight: window.innerHeight };

  componentDidMount() {
    this.props.onRequestNotes();

    window.addEventListener("resize", () => {
      this.setState({ appHeight: window.innerHeight });
    });
  }

  render() {
    const { appHeight } = this.state;

    return (
      <StyledContainer style={{ height: appHeight }}>
        <StyledHeader>
          <AnimateHeightMatch exact path="/" component={Search} />
          <AnimateHeightMatch exact path="/:id" component={ShowHeader} />
        </StyledHeader>
        <StyledBody>
          <Route exact path="/" component={Notes} />
          <Route exact path="/:id" component={Show} />
          <Route exact path="/:id/edit" component={Edit} />
        </StyledBody>
      </StyledContainer>
    );
  }
}

export default withRouter(
  connect(null, {
    onRequestNotes: actions.requestNotes
  })(App)
);
