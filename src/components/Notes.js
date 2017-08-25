import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import BodyWrapper from "./BodyWrapper";
import Note from "./Note";

const matches = (note, search) => {
  const processedSearch = search.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedTitle = note.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedBody =
    note.type === "list"
      ? note.checkedItems
        .concat(note.uncheckedItems)
        .map(item => item.value)
        .join("")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
      : note.body.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    processedTitle.indexOf(processedSearch) !== -1 ||
    processedBody.indexOf(processedSearch) !== -1
  );
};

const StyledEmptyState = styled.div`
  color: #fff;
  opacity: 0.5;
  text-align: center;
  line-height: 48px;
`;

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired
      })
    ).isRequired,
    search: PropTypes.string.isRequired,
    activeIndex: PropTypes.number
  };

  render() {
    const { notes, activeIndex, search } = this.props;
    const visibleNoteIds = notes.filter(note => matches(note, search)).map(note => note.id);

    return (
      <BodyWrapper>
        {visibleNoteIds.length === 0
          ? <StyledEmptyState>No notes found</StyledEmptyState>
          : notes.map((note, index) =>
              <Note
                key={note.id}
                note={note}
                isVisible={visibleNoteIds.includes(note.id)}
                isActive={activeIndex === index}
              />
            )}
      </BodyWrapper>
    );
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotes(state)
});

export default connect(mapStateToProps)(Notes);
