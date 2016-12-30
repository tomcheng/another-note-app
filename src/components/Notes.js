import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Note from "./Note";

class Notes extends Component {
  static propTypes = {
    listHeight: PropTypes.number.isRequired,
    notes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    visibleNoteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    onDeselectNote: PropTypes.func.isRequired,
    onSelectNote: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      id: PropTypes.number,
    }),
  };

  stopPropagation = evt => { evt.stopPropagation(); };

  render () {
    const {
      notes,
      onSelectNote,
      selectedNote,
      onDeselectNote,
      notesLoaded,
      visibleNoteIds,
      listHeight,
    } = this.props;

    if (!notesLoaded) { return <noscript />; }

    return (
      <div
        style={{
          height: selectedNote ? listHeight : null,
          overflow: "auto",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: "6px 5px",
          flexShrink: selectedNote ? 0 : 1,
        }}
        onClick={onDeselectNote}
      >
        <div onClick={this.stopPropagation}>
          {notes.map(note => (
            <Note
              key={note.id}
              note={note}
              onSelectNote={onSelectNote}
              onDeselectNote={onDeselectNote}
              isSelected={!!selectedNote && note.id === selectedNote.id}
              isVisible={visibleNoteIds.includes(note.id)}
            />
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
  selectedNote: selectors.getSelectedNote(state),
  notes: selectors.getNotes(state),
  notesLoaded: selectors.getNotesLoaded(state),
  search: selectors.getSearch(state),
  visibleNoteIds: selectors.getVisibleNoteIds(state),
});

export default connect(mapStateToProps, {
  onSelectNote: actions.selectNote,
  onDeselectNote: actions.deselectNote,
})(Notes);
