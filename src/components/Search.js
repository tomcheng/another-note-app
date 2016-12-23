import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";

const ENTER = 13;

class Search extends Component {
  static propTypes = {
    search: PropTypes.string.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onEditNote: PropTypes.func.isRequired,
    onUpdateSearch: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      id: PropTypes.number,
    }),
  };

  handleChangeSearch = ({ target }) => {
    this.props.onUpdateSearch({ search: target.value });
  };

  handleKeyDown = evt => {
    const { search, selectedNote, onAddNote, onEditNote } = this.props;

    switch (evt.keyCode) {
      case ENTER:
        if (selectedNote) {
          onEditNote();
        } else {
          onAddNote({ title: search });
        }
        break;

      default:
        break;
    }
  };


  render () {
    const { search } = this.props;

    return (
      <input
        value={search}
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
  onEditNote: actions.editNote,
  onUpdateSearch: actions.updateSearch,
})(Search);
