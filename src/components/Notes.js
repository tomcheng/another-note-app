import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { getNotes } from "../reducer";

const Notes = ({ notes }) => (
  <div>
    {notes.map(note => (
      <div key={note.id}>
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
};

const mapStateToProps = state => ({
  notes: getNotes(state),
});

export default connect(mapStateToProps)(Notes);
