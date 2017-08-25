import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import BodyWrapper from "./BodyWrapper";
import Link from "./Link";
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
    search: PropTypes.string.isRequired,
    visibleNoteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    activeIndex: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    if (this.props.activeIndex !== prevProps.activeIndex && this.props.activeIndex !== null) {
      this.linkRefs[this.props.activeIndex].focus();
    }
  }

  linkRefs = {};

  render() {
    const { notes, visibleNoteIds } = this.props;

    return (
      <BodyWrapper>
        {visibleNoteIds.length === 0
          ? <StyledEmptyState>No notes found</StyledEmptyState>
          : notes.map((note, index) =>
              <Link key={note.id} to={"/" + note.id} innerRef={el => { this.linkRefs[index] = el; }}>
                <Note
                  note={note}
                  isVisible={visibleNoteIds.includes(note.id)}
                />
              </Link>
            )}
      </BodyWrapper>
    );
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotes(state),
  search: selectors.getSearch(state),
  visibleNoteIds: selectors.getVisibleNoteIds(state)
});

export default connect(mapStateToProps)(Notes);
