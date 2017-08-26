import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import BodyWrapper from "./BodyWrapper";
import Note from "./Note";

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
    visibleNoteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    activeId: PropTypes.number
  };

  render() {
    const { notes, activeId, visibleNoteIds } = this.props;

    return (
      <BodyWrapper>
        {visibleNoteIds.length === 0
          ? <StyledEmptyState>No notes found</StyledEmptyState>
          : notes.map((note, index) =>
              <Note
                key={note.id}
                note={note}
                isVisible={visibleNoteIds.includes(note.id)}
                isActive={note.id === activeId}
              />
            )}
      </BodyWrapper>
    );
  }
}

export default Notes;
