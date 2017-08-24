import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import EditNote from "./EditNote";
import EditList from "./EditList";

class Edit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    notes: PropTypes.object.isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    const { match, location, notes, notesLoaded } = this.props;

    if (!notesLoaded || !notes[match.params.id]) {
      return <noscript />;
    }

    const selectedNote = notes[match.params.id];

    return selectedNote.type === "note"
      ? <EditNote location={location} note={selectedNote} />
      : <EditList location={location} list={selectedNote} />;
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state),
  notesLoaded: selectors.getNotesLoaded(state)
});

export default connect(mapStateToProps)(Edit);
