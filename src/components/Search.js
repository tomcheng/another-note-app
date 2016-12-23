import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";

const ENTER = 13;
const DELETE = 8;

class Search extends Component {
  static propTypes = {
    search: PropTypes.string.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onDeleteSearch: PropTypes.func.isRequired,
    onEditNote: PropTypes.func.isRequired,
    onUpdateSearch: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      id: PropTypes.number,
    }),
  };

  componentDidUpdate () {
    const { selectedNote, search } = this.props;

    if (selectedNote) {
      this.input.setSelectionRange(search.length, selectedNote.title.length);
    }
  }

  handleChangeSearch = evt => {
    this.props.onUpdateSearch({ search: evt.target.value });
  };

  handleKeyDown = evt => {
    const { search, selectedNote, onAddNote, onEditNote, onDeleteSearch } = this.props;

    switch (evt.keyCode) {
      case ENTER:
        if (selectedNote) {
          onEditNote();
        } else {
          onAddNote({ title: search });
        }
        break;
      case DELETE:
        evt.preventDefault();

        if (!selectedNote || selectedNote.title.length === search.length) {
          onDeleteSearch({ search: search.slice(0, Math.max(search.length - 1, 0)) });
        } else {
          onDeleteSearch({ search });
        }
        break;
      default:
        break;
    }
  };


  render () {
    const { search, selectedNote } = this.props;

    return (
      <input
        ref={el => { this.input = el; }}
        value={selectedNote
          ? search + selectedNote.title.slice(search.length)
          : search}
        type="text"
        onChange={this.handleChangeSearch}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

const mapStateToProps = state => ({
  search: selectors.getSearch(state),
  selectedNote: selectors.getSelectedNote(state),
});

export default connect(mapStateToProps, {
  onAddNote: actions.requestAddNote,
  onDeleteSearch: actions.deleteSearch,
  onEditNote: actions.editNote,
  onUpdateSearch: actions.updateSearch,
})(Search);
