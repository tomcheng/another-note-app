import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";

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

    if (isNavigating) {
      this.input.select();
    } else if (selectedNote) {
      this.input.setSelectionRange(search.length, selectedNote.title.length);
    }
  }

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
    const { search, selectedNote } = this.props;

    return (
      <input
        ref={el => { this.input = el; }}
        value={this.getValue()}
        type="text"
        onChange={this.handleChangeSearch}
        onKeyDown={this.handleKeyDown}
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
