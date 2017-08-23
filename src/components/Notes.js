import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import { withRouter } from "react-router-dom";
import Link from "./Link";
import Note from "./Note";

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    visibleNoteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  render () {
    const {
      notes,
      notesLoaded,
      visibleNoteIds,
    } = this.props;

    if (!notesLoaded) { return <noscript />; }

    return (
      <div style={{ padding: 6 }}>
        {visibleNoteIds.length === 0 ? (
          <div style={{
            color: "#fff",
            opacity: 0.5,
            textAlign: "center",
            lineHeight: "48px",
          }}>
            No notes found
          </div>
        ) : notes.map(note => (
          <Link
            key={note.id}
            to={"/" + note.id}
          >
            <Note
              note={note}
              isSelected={false /* TODO: test if route is active */}
              isVisible={visibleNoteIds.includes(note.id)}
            />
          </Link>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotes(state),
  notesLoaded: selectors.getNotesLoaded(state),
  search: selectors.getSearch(state),
  visibleNoteIds: selectors.getVisibleNoteIds(state),
});

export default withRouter(connect(mapStateToProps)(Notes));
