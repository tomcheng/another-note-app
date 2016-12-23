import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";

export const matches = (search, note) => {
  const processedSearch = search.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedTitle = note.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedBody = note.body.toLowerCase().replace(/[^a-z0-9]/g, "");

  return processedTitle.indexOf(processedSearch) !== -1 ||
    processedBody.indexOf(processedSearch) !== -1;
};

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
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
    const { notes, onSelectNote, selectedNote, notesLoaded, search } = this.props;

    if (!notesLoaded) { return <noscript />; }

    return (
      <div>
        {notes.map(note => (
          <div
            key={note.id}
            onClick={() => onSelectNote({ id: note.id })}
            style={{
              backgroundColor: (selectedNote && note.id === selectedNote.id) ? "#ddd" : null,
              display: matches(search, note) ? "block" : "none",
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
  selectedNote: selectors.getSelectedNote(state),
  notes: selectors.getNotes(state),
  notesLoaded: selectors.getNotesLoaded(state),
  search: selectors.getSearch(state),
});

export default connect(mapStateToProps, {
  onRequestNotes: actions.requestNotes,
  onSelectNote: actions.selectNote,
})(Notes);
