import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";
import Button from "./Button";
import "./Search.css";

class Search extends Component {
  static propTypes = {
    isNavigating: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    onAddList: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onClearIsSearching: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
    onDeleteSearch: PropTypes.func.isRequired,
    onSelectNextNote: PropTypes.func.isRequired,
    onSelectPreviousNote: PropTypes.func.isRequired,
    onSetIsSearching: PropTypes.func.isRequired,
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
    this.props.onSetIsSearching();
  };

  handleBlur = () => {
    this.props.onClearIsSearching();
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
      onSelectNextNote,
      onSelectPreviousNote,
    } = this.props;

    switch (evt.key) {
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

  handleClickAddNote = () => {
    this.props.onAddNote({ title: this.props.search });
  };

  handleClickAddList = () => {
    this.props.onAddList({ title: this.props.search });
  };

  render () {
    const { search } = this.props;

    return (
      <div style={{
        position: "relative",
        padding: "7px 6px 6px",
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
          onBlur={this.handleBlur}
        />
        {search.trim() !== "" && (
          <div style={{
            position: "absolute",
            top: 7,
            right: 10,
            height: 48,
            display: "flex",
            alignItems: "center",
            color: "#fff",
          }}>
            <Button buttonStyle="link" onClick={this.handleClickAddNote}>
              + note
            </Button>
            <Button buttonStyle="link" onClick={this.handleClickAddList}>
              + list
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
  onAddList: actions.requestAddList,
  onAddNote: actions.requestAddNote,
  onClearSearch: actions.clearSearch,
  onClearIsSearching: actions.clearIsSearching,
  onDeleteSearch: actions.deleteSearch,
  onSelectNextNote: actions.selectNextNote,
  onSelectPreviousNote: actions.selectPreviousNote,
  onSetIsSearching: actions.setIsSearching,
  onUpdateSearch: actions.updateSearch,
})(Search);
