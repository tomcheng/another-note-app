import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Button from "./Button";
import "./Search.css";

class Search extends Component {
  static propTypes = {
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    search: PropTypes.string.isRequired,
    onAddList: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
    onDeleteSearch: PropTypes.func.isRequired,
    onUpdateSearch: PropTypes.func.isRequired,
  };

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

  handleClickClear = () => {
    this.props.onClearSearch();
  };

  handleClickAddNote = () => {
    const { router, onAddNote, search } = this.props;

    onAddNote({
      title: search,
      callback: ({ note }) => {
        router.push("/" + note.id);
        router.push("/" + note.id + "/edit?focus=body");
      },
    });
  };

  handleClickAddList = () => {
    const { router, onAddList, search } = this.props;

    onAddList({
      title: search,
      callback: ({ note }) => {
        router.push("/" + note.id);
        router.push("/" + note.id + "/edit?focus=addItem");
      },
    });
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
          placeholder="Search or add notes and lists"
          ref={el => { this.input = el; }}
          type="text"
          value={search}
          onChange={this.handleChangeSearch}
          onFocus={this.handleFocus}
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
  search: selectors.getSearch(state),
});

export default withRouter(connect(mapStateToProps, {
  onAddList: actions.requestAddList,
  onAddNote: actions.requestAddNote,
  onClearSearch: actions.clearSearch,
  onDeleteSearch: actions.deleteSearch,
  onUpdateSearch: actions.updateSearch,
})(Search));
