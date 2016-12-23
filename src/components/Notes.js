import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    onRequestNotes: PropTypes.func.isRequired,
    onSelectNote: PropTypes.func.isRequired,
    activeNote: PropTypes.shape({
      id: PropTypes.number,
    }),
  };

  componentDidMount () {
    this.props.onRequestNotes();
  }

  render () {
    const { notes, onSelectNote, activeNote, notesLoaded } = this.props;

    if (!notesLoaded) { return <noscript />; }

    return (
      <div>
        {notes.map(note => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            style={{
              backgroundColor: (activeNote && note.id === activeNote.id) ? "#ddd" : null,
            }}
          >
            {note.title} - {note.body}
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeNote: selectors.getActiveNote(state),
  notes: selectors.getNotes(state),
  notesLoaded: selectors.getNotesLoaded(state),
  search: selectors.getSearch(state),
});

export default connect(mapStateToProps, {
  onRequestNotes: actions.requestNotes,
  onSelectNote: actions.selectNote,
})(Notes);
