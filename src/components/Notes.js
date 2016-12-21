import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { getNotes } from "../reducer";

const Notes = ({ notes }) => (
  <div>
    {notes.map((note, index) => (
      <div key={index}>
        {note.title}
      </div>
    ))}
  </div>
);

Notes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })).isRequired,
};

const mapStateToProps = state => ({
  notes: getNotes(state),
});

export default connect(mapStateToProps)(Notes);
