import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Note from "./Note";

class Notes extends Component {
  static propTypes = {
    containerStyle: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    listHeight: PropTypes.number.isRequired,
    notes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    visibleNoteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    onDeselectNote: PropTypes.func.isRequired,
    onRequestNotes: PropTypes.func.isRequired,
    onSelectNote: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      id: PropTypes.number,
    }),
  };

  componentDidMount () {
    this.props.onRequestNotes();
  }

  stopPropagation = evt => { evt.stopPropagation(); };

  render () {
    const {
      containerStyle,
      notes,
      onSelectNote,
      selectedNote,
      onDeselectNote,
      notesLoaded,
      visibleNoteIds,
      isEditing,
      listHeight,
    } = this.props;

    if (!notesLoaded) { return <noscript />; }

    return (
      <div
        style={{
          ...containerStyle,
          height: listHeight,
          overflow: "auto",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          borderBottom: "1px solid rgba(0,0,0,0.18)",
          padding: "4px 5px",
          display: isEditing ? "none" : null,
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
              isFaded={!!selectedNote && note.id !== selectedNote.id}
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
  isEditing: selectors.getIsEditing(state),
});

export default connect(mapStateToProps, {
  onRequestNotes: actions.requestNotes,
  onSelectNote: actions.selectNote,
  onDeselectNote: actions.deselectNote,
})(Notes);
