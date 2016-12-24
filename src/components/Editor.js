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
      title: PropTypes.string,
    }),
  };

  constructor (props) {
    super(props);

    const { selectedNote } = props;

    this.state = {
      body: selectedNote ? selectedNote.body : null,
      title: selectedNote ? selectedNote.title : null,
    };
  }


  componentWillReceiveProps (nextProps) {
    if (!this.props.isEditingNoteBody && nextProps.isEditingNoteBody) {
      setTimeout(() => {
        this.textarea.focus();
      }, 0);
    }

    if (this.props.selectedNote !== nextProps.selectedNote) {
      this.setState({
        body: nextProps.selectedNote ? nextProps.selectedNote.body : null,
        title: nextProps.selectedNote ? nextProps.selectedNote.title : null,
      });
    }
  }

  handleChangeField = ({ target }) => {
    this.setState({ [target.name]: target.value })
  };

  handleBlurTitle = () => {
    const { onUpdateNote, selectedNote, onCancelEditNoteTitle } = this.props;
    const { title } = this.state;

    if (title !== selectedNote.title) {
      onUpdateNote({
        id: selectedNote.id,
        updates: { title: title.replace(/\n/g, "") },
      });
    }

    onCancelEditNoteTitle();
  };

  handleBlurBody = () => {
    const { onUpdateNote, selectedNote, onCancelEditNoteBody } = this.props;
    const { body } = this.state;

    if (body !== selectedNote.body) {
      onUpdateNote({
        id: selectedNote.id,
        updates: { body },
      });
    }

    onCancelEditNoteBody();
  };

  handleKeyDownTitle = evt => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.props.onEditNoteBody();
    }
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
      onDeleteNote,
      search,
    } = this.props;
    const { title, body } = this.state;

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
        backgroundColor: "#fff",
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
        <Textarea
          name="title"
          value={title}
          style={{
            padding: "3px 5px",
            margin: "8px 7px 0",
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "inherit",
            lineHeight: "inherit",
            border: 0,
            resize: "none",
          }}
          onFocus={onEditNoteTitle}
          onBlur={this.handleBlurTitle}
          onChange={this.handleChangeField}
          onKeyDown={this.handleKeyDownTitle}
        />
        <Textarea
          name="body"
          value={body}
          placeholder="Add to this note"
          ref={el => { this.textarea = el; }}
          onChange={this.handleChangeField}
          onBlur={this.handleBlurBody}
          onFocus={onEditNoteBody}
          minRows={3}
          style={{
            display: "block",
            fontFamily: "inherit",
            lineHeight: "inherit",
            fontSize: "inherit",
            color: "inherit",
            padding: "2px 5px",
            margin: "0 7px 12px",
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
