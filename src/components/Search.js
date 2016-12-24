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
    onEditNoteBody: PropTypes.func.isRequired,
    onSelectNextNote: PropTypes.func.isRequired,
    onSelectPreviousNote: PropTypes.func.isRequired,
    onUpdateSearch: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      id: PropTypes.number,
    }),
  };

  componentDidUpdate () {
    const { isNavigating } = this.props;

    if (this.input !== document.activeElement) { return; }

    if (isNavigating) {
      this.input.select();
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
      onEditNoteBody,
      onSelectNextNote,
      onSelectPreviousNote,
    } = this.props;

    switch (evt.key) {
      case "Enter":
        if (selectedNote) {
          onEditNoteBody();
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
        placeholder="Search or add notes"
        ref={el => { this.input = el; }}
        type="text"
        style={{
          width: "100%",
          padding: "0 12px",
          height: 48,
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
  onEditNoteBody: actions.editNoteBody,
  onSelectNextNote: actions.selectNextNote,
  onSelectPreviousNote: actions.selectPreviousNote,
  onUpdateSearch: actions.updateSearch,
})(Search);
