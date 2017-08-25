import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IconWithText from "./IconWithText";

const StyledContainer = styled.div`
  padding: 0 10px 0 6px;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  width: 100%;
  padding: 0 9px;
  color: #fff;
  background-color: transparent;

  &::-webkit-input-placeholder {
    color: rgba(255,255,255,0.5);
  }
  &::-moz-placeholder {
    color: rgba(255,255,255,0.5);
  }
  &:-ms-input-placeholder {
    color: rgba(255,255,255,0.5);
  }
  &:focus {
    background-color: transparent;
  }
`;

const StyledIcons = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
`;

class Search extends Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    search: PropTypes.string.isRequired,
    onAddList: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
    onUpdateSearch: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (this.props.isActive) {
      this.input.focus();
    }

    // Needs to be keyup to not trigger change on edit screen
    this.input.addEventListener("keyup", this.handleKeyUp);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.input.focus();
    }
  }

  componentWillUnmount() {
    this.input.removeEventListener("keyup", this.handleKeyUp);
  }

  input = null;

  handleFocus = () => {
    this.input.select();
  };

  handleKeyUp = evt => {
    if (evt.code === "Escape") {
      this.handleClickClear();
    } else if (evt.code === "Enter" && this.props.search.trim() !== "") {
      this.handleClickAddList();
    }
  };

  handleChangeSearch = ({ target }) => {
    this.props.onUpdateSearch(target.value);
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
      }
    });
  };

  handleClickAddList = () => {
    const { history, onAddList, search } = this.props;
    const focus = search.trim() === "" ? "title" : "addItem";

    onAddList({
      title: search,
      callback: ({ note }) => {
        history.push("/" + note.id + "/edit?just_added=true&focus=" + focus);
      }
    });
  };

  render() {
    const { search } = this.props;

    return (
      <StyledContainer>
        <StyledInput
          placeholder="Type to Search or Add"
          innerRef={el => {
            this.input = el;
          }}
          type="text"
          value={search}
          onChange={this.handleChangeSearch}
          onFocus={this.handleFocus}
        />
        <StyledIcons>
          {search.trim() !== "" &&
            <div onClick={this.handleClickClear}>
              <IconWithText icon="close" text="Clear" />
            </div>}
          <div onClick={this.handleClickAddList}>
            <IconWithText icon="list" text="Add List" width={54} />
          </div>
          <div onClick={this.handleClickAddNote}>
            <IconWithText icon="note" text="Add Note" width={54} />
          </div>
        </StyledIcons>
      </StyledContainer>
    );
  }
}

export default withRouter(
  connect(null, {
    onAddList: actions.requestAddList,
    onAddNote: actions.requestAddNote,
  })(Search)
);
