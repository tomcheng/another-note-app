import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";

class Search extends Component {
  static propTypes = {
    isNavigating: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onDeleteSearch: PropTypes.func.isRequired,
    onDeselectNote: PropTypes.func.isRequired,
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
    const { search, onDeselectNote } = this.props;

    this.input.select();

    if (search === "") {
      onDeselectNote();
    }
  };

  handleChangeSearch = ({ target }) => {
    const { search, onUpdateSearch, onDeleteSearch } = this.props;

    if (target.value.length < search.length) {
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

  render () {
    const { search } = this.props;

    return (
      <input
        placeholder="Search or create a new note"
        ref={el => { this.input = el; }}
        type="text"
        style={{
          width: "100%",
          padding: "0 10px",
          height: 40,
          borderWidth: "0 0 1px 0",
          borderColor: "#ccc",
        }}
        value={search}
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
  onDeselectNote: actions.deselectNote,
  onEditNote: actions.editNote,
  onSelectNextNote: actions.selectNextNote,
  onSelectPreviousNote: actions.selectPreviousNote,
  onUpdateSearch: actions.updateSearch,
})(Search);
