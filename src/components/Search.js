import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Button from "./Button";
import IconWithText from "./IconWithText";
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
        padding: "0 10px",
        borderBottom: "1px solid rgba(255,255,255,1)",
        display: "flex",
        alignItems: "center",
      }}>
        <input
          className="SearchInput"
          style={{ flexGrow: 1 }}
          placeholder="Search or Add"
          ref={el => { this.input = el; }}
          type="text"
          value={search}
          onChange={this.handleChangeSearch}
          onFocus={this.handleFocus}
        />
        <div style={{
          display: "flex",
          alignItems: "center",
          color: "#fff",
        }}>
          {search.trim() !== "" && (
            <div onClick={this.handleClickClear}>
              <IconWithText icon="close" text="Clear" />
            </div>
          )}
          <div onClick={this.handleClickAddList}>
            <IconWithText icon="list" text="Add List" />
          </div>
          <div onClick={this.handleClickAddNote}>
            <IconWithText icon="note" text="Add Note" />
          </div>
        </div>
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
