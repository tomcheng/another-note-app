import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import { Link, withRouter } from "react-router";
import Note from "./Note";

class Notes extends Component {
  static propTypes = {
    router: PropTypes.shape({
      isActive: PropTypes.func.isRequired,
    }).isRequired,
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
      router,
      visibleNoteIds,
    } = this.props;

    if (!notesLoaded) { return <noscript />; }

    return (
      <div
        style={{
          overflow: "auto",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: "6px 5px",
          flexShrink: 1,
        }}
      >
        <div>
          {notes.map(note => (
            <Link
              key={note.id}
              to={"/" + note.id}
            >
              <Note
                note={note}
                isSelected={router.isActive("/" + note.id)}
                isVisible={visibleNoteIds.includes(note.id)}
              />
            </Link>
          ))}
        </div>
        {visibleNoteIds.length === 0 && (
          <div style={{
            color: "#fff",
            opacity: 0.5,
            textAlign: "center",
            lineHeight: "48px",
          }}>
            No notes found
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  listHeight: selectors.getListHeight(state),
  notes: selectors.getNotes(state),
  notesLoaded: selectors.getNotesLoaded(state),
  search: selectors.getSearch(state),
  visibleNoteIds: selectors.getVisibleNoteIds(state),
});

export default withRouter(connect(mapStateToProps)(Notes));
