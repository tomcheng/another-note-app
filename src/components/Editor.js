import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Textarea from "react-textarea-autosize";
import NoteMenu from "./NoteMenu";
import FullWidthButton from "./FullWidthButton";

class Editor extends Component {
  static propTypes = {
    isEditingNoteBody: PropTypes.bool.isRequired,
    isEditingNoteTitle: PropTypes.bool.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onCancelEditNoteBody: PropTypes.func.isRequired,
    onCancelEditNoteTitle: PropTypes.func.isRequired,
    onEditNoteBody: PropTypes.func.isRequired,
    onEditNoteTitle: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
    search: PropTypes.string.isRequired,
    selectedNote: PropTypes.shape({
      body: PropTypes.string,
    }),
  };

  componentWillReceiveProps (nextProps) {
    if (!this.props.isEditingNoteBody && nextProps.isEditingNoteBody) {
      setTimeout(() => {
        this.textarea.focus();
      }, 0);
    }
  }

  handleChangeTitle = ({ target }) => {
    const { selectedNote, onUpdateNote } = this.props;

    onUpdateNote({
      id: selectedNote.id,
      updates: { title: target.value }
    });
  };

  handleChangeBody = ({ target }) => {
    const { selectedNote, onUpdateNote } = this.props;

    onUpdateNote({
      id: selectedNote.id,
      updates: { body: target.value }
    });
  };

  handleClickAddNote = () => {
    this.props.onAddNote({ title: this.props.search });
  };

  render () {
    const {
      selectedNote,
      isEditingNoteBody,
      isEditingNoteTitle,
      onEditNoteBody,
      onEditNoteTitle,
      onCancelEditNoteBody,
      onCancelEditNoteTitle,
      onDeleteNote,
      search,
    } = this.props;

    if (!selectedNote) {
      if (search.trim() === "") { return <noscript />; }

      return (
        <FullWidthButton onClick={this.handleClickAddNote}>
          Add&nbsp;<em>{search}</em>
        </FullWidthButton>
      );
    }

    const isEditing = isEditingNoteBody || isEditingNoteTitle;

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        boxShadow: "0 -1px 4px rgba(0,0,0,0.08), 0 -1px 2px rgba(0,0,0,0.12)",
      }}>
        {!isEditing && (
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
          }}>
            <NoteMenu
              selectedNote={selectedNote}
              onDeleteNote={onDeleteNote}
            />
          </div>
        )}
        <input
          value={selectedNote.title}
          style={{
            padding: "0 7px",
            margin: "10px 5px 0",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "28px",
            border: 0,
          }}
          onFocus={onEditNoteTitle}
          onBlur={onCancelEditNoteTitle}
          onChange={this.handleChangeTitle}
        />
        <Textarea
          placeholder="Add to this note"
          value={selectedNote.body}
          ref={el => { this.textarea = el; }}
          onChange={this.handleChangeBody}
          onBlur={onCancelEditNoteBody}
          onFocus={onEditNoteBody}
          minRows={3}
          style={{
            display: "block",
            fontFamily: "inherit",
            lineHeight: "inherit",
            fontSize: "inherit",
            color: "inherit",
            padding: "2px 5px 5px",
            margin: "0 7px 10px",
            resize: "none",
            border: "0",
          }}
        />
        {isEditing && (
          <FullWidthButton>
            Done
          </FullWidthButton>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: selectors.getSearch(state),
  selectedNote: selectors.getSelectedNote(state),
  isEditingNoteBody: selectors.getIsEditingNoteBody(state),
  isEditingNoteTitle: selectors.getIsEditingNoteTitle(state),
});

export default connect(mapStateToProps, {
  onAddNote: actions.requestAddNote,
  onCancelEditNoteBody: actions.cancelEditNoteBody,
  onCancelEditNoteTitle: actions.cancelEditNoteTitle,
  onDeleteNote: actions.requestDeleteNote,
  onEditNoteBody: actions.editNoteBody,
  onEditNoteTitle: actions.editNoteTitle,
  onUpdateNote: actions.requestUpdateNote,
})(Editor);
