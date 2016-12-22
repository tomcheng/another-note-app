import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { getNotes, getActiveNote, getSearch, selectNote } from "../reducer";

const Notes = ({ notes, onSelectNote, activeNote }) => (
  <div>
    {notes.map(note => (
      <div
        key={note.id}
        onClick={() => onSelectNote(note.id)}
        style={{
          backgroundColor: note.id === activeNote.id ? "#ddd" : null,
        }}
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
  activeNote: PropTypes.shape({
    id: PropTypes.number,
  }),
};

const mapStateToProps = state => ({
  notes: getNotes(state),
  activeNote: getActiveNote(state),
  search: getSearch(state),
});

export default connect(mapStateToProps, {
  onSelectNote: selectNote,
})(Notes);
