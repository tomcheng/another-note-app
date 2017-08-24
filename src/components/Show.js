import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
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
    notes: PropTypes.object.isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  componentDidMount() {
    const { notesLoaded } = this.props;
    const selectedNote = this.getSelectedNote();

    if (notesLoaded && !selectedNote) {
      window.history.back();
    }
  }

  getSelectedNote = (props = this.props) => {
    const { notes } = props;
    const { params } = props.match;

    return notes[params.id];
  };

  render() {
    const selectedNote = this.getSelectedNote();

    if (!selectedNote) {
      return <noscript />;
    }

    return (
      <BodyWrapper>
        {selectedNote.type === "list" && <ShowList list={selectedNote} />}
        {selectedNote.type === "note" && <ShowNote note={selectedNote} />}
        <StyledFooter>
          Created {moment(selectedNote.createdAt).format("MMM D, YYYY")}
        </StyledFooter>
      </BodyWrapper>
    );
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state),
  notesLoaded: selectors.getNotesLoaded(state)
});

export default connect(mapStateToProps, {
  onConvertNoteToList: actions.requestConvertNoteToList,
  onDeleteNote: actions.requestDeleteNote,
  onUpdateNote: actions.requestUpdateNote
})(Show);
