import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import EditNote from "./EditNote";

class Single extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    notes: PropTypes.object.isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  render () {
    const { params, location, notes, notesLoaded } = this.props;

    if (!notesLoaded) { return <noscript />; }

    const selectedNote = notes[params.id];

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}>
        {selectedNote.type === "note" && (
          <EditNote location={location} note={selectedNote} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state),
  notesLoaded: selectors.getNotesLoaded(state),
});

export default connect(mapStateToProps)(Single);