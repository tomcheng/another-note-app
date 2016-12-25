import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";
import Button from "./Button";
import "./Search.css";

class Search extends Component {
  static propTypes = {
    isNavigating: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
    onDeleteSearch: PropTypes.func.isRequired,
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
    this.input.select();
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

  handleClickClear = () => {
    this.props.onClearSearch();
  };

  handleClickAdd = () => {
    this.props.onAddNote({ title: this.props.search });
  };

  render () {
    const { search } = this.props;

    return (
      <div style={{
        position: "relative",
        padding: 5,
        borderBottom: "1px solid rgba(0,0,0,0.18)",
      }}>
        <input
          className="SearchInput"
          placeholder="Search or add notes"
          ref={el => { this.input = el; }}
          type="text"
          value={search}
          onChange={this.handleChangeSearch}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
        />
        {search.trim() !== "" && (
          <div style={{
            position: "absolute",
            top: 5,
            right: 10,
            height: 48,
            display: "flex",
            alignItems: "center",
            color: "#fff",
          }}>
            <Button buttonStyle="link" style={{ color: "#fff" }} onClick={this.handleClickAdd}>
              + note
            </Button>
            <Button buttonStyle="link" onClick={this.handleClickClear}>
              clear
            </Button>
          </div>
        )}
      </div>
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
  onClearSearch: actions.clearSearch,
  onDeleteSearch: actions.deleteSearch,
  onEditNoteBody: actions.editNoteBody,
  onSelectNextNote: actions.selectNextNote,
  onSelectPreviousNote: actions.selectPreviousNote,
  onUpdateSearch: actions.updateSearch,
})(Search);
