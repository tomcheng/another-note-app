import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";
import "./Search.css";

class Search extends Component {
  static propTypes = {
    isNavigating: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onDeleteSearch: PropTypes.func.isRequired,
    onEditNote: PropTypes.func.isRequired,
    onSelectNextNote: PropTypes.func.isRequired,
    onSelectPreviousNote: PropTypes.func.isRequired,
    onUpdateSearch: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      id: PropTypes.number,
    }),
  };

  componentDidUpdate () {
    const { selectedNote, search, isNavigating } = this.props;

    if (this.input !== document.activeElement) { return; }

    if (isNavigating) {
      this.input.select();
    } else if (selectedNote) {
      // Set timeout to get it working for mobile
      setTimeout(() => {
        this.input.setSelectionRange(search.length, selectedNote.title.length, "forward");
      }, 0);
    }
  }

  handleFocus = () => {
    this.input.select();
  };

  handleChangeSearch = ({ target }) => {
    const { search, selectedNote, onUpdateSearch, onDeleteSearch } = this.props;

    if (target.value.length < search.length || (selectedNote && target.value === search)) {
      onDeleteSearch({ search: target.value });
    } else {
      onUpdateSearch({ search: target.value });
    }
  };

  handleKeyDown = evt => {
    const {
      search,
      selectedNote,
      onAddNote,
      onEditNote,
      onSelectNextNote,
      onSelectPreviousNote,
    } = this.props;

    switch (evt.key) {
      case "Enter":
        if (selectedNote) {
          onEditNote();
        } else {
          onAddNote({ title: search });
        }
        break;
      case "ArrowDown":
        evt.preventDefault();
        onSelectNextNote();
        break;
      case "ArrowUp":
        evt.preventDefault();
        onSelectPreviousNote();
        break;
      default:
        break;
    }
  };

  getValue = () => {
    const { selectedNote, search, isNavigating } = this.props;

    if (isNavigating) {
      return selectedNote ? selectedNote.title : search;
    }

    return selectedNote ? search + selectedNote.title.slice(search.length) : search;
  };

  render () {
    return (
      <input
        placeholder="Search or create a new note"
        className="SearchInput"
        ref={el => { this.input = el; }}
        value={this.getValue()}
        type="text"
        onChange={this.handleChangeSearch}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
      />
    );
  }
}

const mapStateToProps = state => ({
  isNavigating: selectors.getIsNavigating(state),
  search: selectors.getSearch(state),
  selectedNote: selectors.getSelectedNote(state),
});

export default connect(mapStateToProps, {
  onAddNote: actions.requestAddNote,
  onDeleteSearch: actions.deleteSearch,
  onEditNote: actions.editNote,
  onSelectNextNote: actions.selectNextNote,
  onSelectPreviousNote: actions.selectPreviousNote,
  onUpdateSearch: actions.updateSearch,
})(Search);
