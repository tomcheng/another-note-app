import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Note from "./Note";

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    visibleNoteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    onRequestNotes: PropTypes.func.isRequired,
    onSelectNote: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      id: PropTypes.number,
    }),
  };

  componentDidMount () {
    this.props.onRequestNotes();
  }

  render () {
    const { notes, onSelectNote, selectedNote, notesLoaded, visibleNoteIds } = this.props;

    if (!notesLoaded) { return <noscript />; }

    return (
      <div>
        {notes.map(note => (
          <Note
            key={note.id}
            note={note}
            onSelectNote={onSelectNote}
            isSelected={!!selectedNote && note.id === selectedNote.id}
            isVisible={visibleNoteIds.includes(note.id)}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedNote: selectors.getSelectedNote(state),
  notes: selectors.getNotes(state),
  notesLoaded: selectors.getNotesLoaded(state),
  search: selectors.getSearch(state),
  visibleNoteIds: selectors.getVisibleNoteIds(state),
});

export default connect(mapStateToProps, {
  onRequestNotes: actions.requestNotes,
  onSelectNote: actions.selectNote,
})(Notes);
