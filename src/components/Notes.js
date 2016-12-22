import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { getNotes, selectNote } from "../reducer";

const Notes = ({ notes, onSelectNote }) => (
  <div>
    {notes.map(note => (
      <div
        key={note.id}
        onClick={() => onSelectNote(note.id)}
      >
        {note.title} - {note.body}
      </div>
    ))}
  </div>
);

Notes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  onSelectNote: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notes: getNotes(state),
});

export default connect(mapStateToProps, {
  onSelectNote: selectNote,
})(Notes);
