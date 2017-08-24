import PropTypes from 'prop-types';
import React, { Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IconWithText from "./IconWithText";
import "./Search.css";

class Search extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    search: PropTypes.string.isRequired,
    onAddList: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
    onUpdateSearch: PropTypes.func.isRequired,
  };

  handleFocus = () => {
    this.input.select();
  };

  handleChangeSearch = ({ target }) => {
    this.props.onUpdateSearch({ search: target.value });
  };

  handleClickClear = () => {
    this.props.onClearSearch();
  };

  handleClickAddNote = () => {
    const { history, onAddNote, search } = this.props;
    const focus = search.trim() === "" ? "title" : "body";

    onAddNote({
      title: search,
      callback: ({ note }) => {
        history.push("/" + note.id + "/edit?just_added=true&focus=" + focus);
      },
    });
  };

  handleClickAddList = () => {
    const { history, onAddList, search } = this.props;
    const focus = search.trim() === "" ? "title" : "addItem";

    onAddList({
      title: search,
      callback: ({ note }) => {
        history.push("/" + note.id + "/edit?just_added=true&focus=" + focus);
      },
    });
  };

  render () {
    const { search } = this.props;

    return (
      <div style={{
        padding: "0 10px 0 6px",
        display: "flex",
        alignItems: "center",
      }}>
        <input
          className="SearchInput"
          style={{ flexGrow: 1 }}
          placeholder="Type to Search or Add"
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
          <div onClick={this.handleClickAddNote}>
            <IconWithText icon="note" text="Add Note" width={54} />
          </div>
          <div onClick={this.handleClickAddList}>
            <IconWithText icon="list" text="Add List" width={54} />
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
  onUpdateSearch: actions.updateSearch,
})(Search));
