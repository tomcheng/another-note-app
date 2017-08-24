import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import moment from "moment";
import BodyWrapper from "./BodyWrapper";
import ShowNote from "./ShowNote";
import ShowList from "./ShowList";

const StyledFooter = styled.div`
  color: #fff;
  font-size: 11px;
  text-align: center;
  margin-top: 2px;
  font-weight: 300;
`;

class Show extends Component {
  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired
    }).isRequired,
    notes: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    const { notes, match } = this.props;
    const selectedNote = notes[match.params.id];

    return selectedNote
      ? <BodyWrapper>
          {selectedNote.type === "list" && <ShowList list={selectedNote} />}
          {selectedNote.type === "note" && <ShowNote note={selectedNote} />}
          <StyledFooter>
            Created {moment(selectedNote.createdAt).format("MMM D, YYYY")}
          </StyledFooter>
        </BodyWrapper>
      : <Redirect to="/" />;
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state)
});

export default withRouter(
  connect(mapStateToProps, {
    onConvertNoteToList: actions.requestConvertNoteToList,
    onDeleteNote: actions.requestDeleteNote,
    onUpdateNote: actions.requestUpdateNote
  })(Show)
);
