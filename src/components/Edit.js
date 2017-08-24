import PropTypes from "prop-types";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import EditNote from "./EditNote";
import EditList from "./EditList";

class Edit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    notes: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    const { match, location, notes } = this.props;
    const selectedNote = notes[match.params.id];

    if (!selectedNote) {
      return <Redirect to="/" />;
    }

    return selectedNote.type === "note"
      ? <EditNote location={location} note={selectedNote} />
      : <EditList location={location} list={selectedNote} />;
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state)
});

export default connect(mapStateToProps)(Edit);
