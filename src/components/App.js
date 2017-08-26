import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import { Route, withRouter } from "react-router-dom";
import { memoize } from "../utils/helpers";
import AnimateHeight from "./AnimateHeight";
import Search from "./Search";
import ShowHeader from "./ShowHeader";
import Notes from "./Notes";
import Show from "./Show";
import Edit from "./Edit";

const matches = (note, search) => {
  const processedSearch = search.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedTitle = note.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedBody =
    note.type === "list"
      ? note.checkedItems
          .concat(note.uncheckedItems)
          .map(item => item.value)
          .join("")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
      : note.body.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    processedTitle.indexOf(processedSearch) !== -1 ||
    processedBody.indexOf(processedSearch) !== -1
  );
};

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

const AnimateHeightMatch = ({
  component: Component,
  componentProps,
  ...other
}) =>
  <Route
    {...other}
    children={({ match }) =>
      <AnimateHeight
        isExpanded={!!match}
        duration={100}
        easing="linear"
        fadeFirst
      >
        <Component {...componentProps} />
      </AnimateHeight>}
  />;

class App extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired
      })
    ).isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    onRequestNotes: PropTypes.func.isRequired
  };

  state = {
    appHeight: window.innerHeight,
    activeIndex: null,
    search: ""
  };

  componentDidMount() {
    this.props.onRequestNotes();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleClearSearch = () => {
    this.setState({ search: "" });
  };

  handleUpdateSearch = search => {
    this.setState({ search });
  };

  handleResize = () => {
    this.setState({ appHeight: window.innerHeight });
  };

  handleKeyDown = evt => {
    const { notes } = this.props;

    if (evt.code === "ArrowDown") {
      this.setState(state => {
        const activeIndex =
          state.activeIndex === null && notes.length > 0
            ? 0
            : Math.min(state.activeIndex + 1, notes.length - 1);
        return { ...state, activeIndex };
      });
    } else if (evt.code === "ArrowUp") {
      this.setState(state => {
        const activeIndex =
          state.activeIndex === null || state.activeIndex === 0
            ? null
            : state.activeIndex - 1;
        return { ...state, activeIndex };
      });
    }
  };

  getVisibleIds = memoize((notes, search) =>
    notes.filter(note => matches(note, search)).map(note => note.id)
  );

  render() {
    const { notesLoaded, notes } = this.props;
    const { appHeight, activeIndex, search } = this.state;

    if (!notesLoaded) {
      return <noscript />;
    }

    return (
      <StyledContainer style={{ height: appHeight }}>
        <StyledHeader>
          <AnimateHeightMatch
            exact
            path="/"
            component={Search}
            componentProps={{
              isActive: activeIndex === null,
              onClearSearch: this.handleClearSearch,
              onUpdateSearch: this.handleUpdateSearch,
              search
            }}
          />
          <AnimateHeightMatch exact path="/:id" component={ShowHeader} />
        </StyledHeader>
        <StyledBody>
          <Route
            exact
            path="/"
            render={() =>
              <Notes
                activeIndex={activeIndex}
                notes={notes}
                visibleNoteIds={this.getVisibleIds(notes, search)}
              />}
          />
          <Route exact path="/:id" component={Show} />
          <Route exact path="/:id/edit" component={Edit} />
        </StyledBody>
      </StyledContainer>
    );
  }
}

const mapStateToProps = state => ({
  notesLoaded: selectors.getNotesLoaded(state),
  notes: selectors.getNotes(state)
});

export default withRouter(
  connect(mapStateToProps, {
    onRequestNotes: actions.requestNotes
  })(App)
);
