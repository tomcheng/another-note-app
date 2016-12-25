import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import TextInput from "./TextInput";
import Button from "./Button";
import NoteMenu from "./NoteMenu";
import ListManager from "./ListManager";

class Editor extends Component {
  static propTypes = {
    containerStyle: PropTypes.object.isRequired,
    isEditingNoteBody: PropTypes.bool.isRequired,
    isEditingNoteTitle: PropTypes.bool.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onCancelEditNoteBody: PropTypes.func.isRequired,
    onCancelEditNoteTitle: PropTypes.func.isRequired,
    onConvertNoteToList: PropTypes.func.isRequired,
    onEditNoteBody: PropTypes.func.isRequired,
    onEditNoteTitle: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
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

  render () {
    const {
      containerStyle,
      selectedNote,
      isEditingNoteBody,
      isEditingNoteTitle,
      onConvertNoteToList,
      onDeleteNote,
      onEditNoteBody,
      onEditNoteTitle,
    } = this.props;
    const { title, body } = this.state;

    if (!selectedNote) { return <noscript />; }

    const isEditing = isEditingNoteBody || isEditingNoteTitle;

    return (
      <div style={{
        ...containerStyle,
        position: "relative", // for box shadow to show
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ flexShrink: 1, overflow: "auto" }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
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
                  onConvertNoteToList={onConvertNoteToList}
                  onDeleteNote={onDeleteNote}
                />
              </div>
            )}
            <TextInput
              name="title"
              value={title}
              style={{
                margin: "8px 7px 0",
                fontSize: 16,
                fontWeight: 500,
                color: "rgba(255,255,255,0.95)",
              }}
              onFocus={onEditNoteTitle}
              onBlur={this.handleBlurTitle}
              onChange={this.handleChangeField}
              onKeyDown={this.handleKeyDownTitle}
            />
            {selectedNote.type === "list" ? (
              <div style={{ margin: "0 12px 12px" }}>
                <ListManager list={selectedNote} />
              </div>
            ) : (
              <TextInput
                name="body"
                value={body}
                placeholder="Add to this note"
                ref={el => { this.textarea = el; }}
                onChange={this.handleChangeField}
                onBlur={this.handleBlurBody}
                onFocus={onEditNoteBody}
                minRows={3}
                style={{
                  color: "rgba(255,255,255,0.75)",
                  margin: "0 7px 12px",
                }}
              />
            )}
          </div>
        </div>
        {isEditing && (
          <div style={{
            flexShrink: 0,
            textAlign: "right",
            padding: "0 12px 12px"
          }}>
            <Button buttonStyle="ghost">
              Done
            </Button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedNote: selectors.getSelectedNote(state),
  isEditingNoteBody: selectors.getIsEditingNoteBody(state),
  isEditingNoteTitle: selectors.getIsEditingNoteTitle(state),
});

export default connect(mapStateToProps, {
  onAddNote: actions.requestAddNote,
  onCancelEditNoteBody: actions.cancelEditNoteBody,
  onCancelEditNoteTitle: actions.cancelEditNoteTitle,
  onConvertNoteToList: actions.requestConvertNoteToList,
  onDeleteNote: actions.requestDeleteNote,
  onEditNoteBody: actions.editNoteBody,
  onEditNoteTitle: actions.editNoteTitle,
  onUpdateNote: actions.requestUpdateNote,
})(Editor);
