import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import TextInput from "./TextInput";
import Button from "./Button";
import NoteMenu from "./NoteMenu";
import ListManager from "./ListManager";

class Preview extends Component {
  static propTypes = {
    containerStyle: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isEditingNoteBody: PropTypes.bool.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onCancelEditing: PropTypes.func.isRequired,
    onConvertNoteToList: PropTypes.func.isRequired,
    onEditNoteBody: PropTypes.func.isRequired,
    onEditNoteTitle: PropTypes.func.isRequired,
    onSetAddListItem: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      body: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.oneOf(["list", "note"]).isRequired,
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
        this.bodyField.focus();
      }, 0);
    }

    if (this.props.selectedNote !== nextProps.selectedNote) {
      this.setState({
        body: nextProps.selectedNote ? nextProps.selectedNote.body : null,
        title: nextProps.selectedNote ? nextProps.selectedNote.title : null,
      });
    }
  }

  handleChangeTitle = ({ target }) => {
    this.setState({ title: target.value });
  };

  handleChangeBody = ({ target }) => {
    this.setState({ body: target.value })
  };

  handleBlurTitle = () => {
    const { onUpdateNote, selectedNote } = this.props;
    const { title } = this.state;

    if (title !== selectedNote.title) {
      onUpdateNote({
        id: selectedNote.id,
        updates: { title },
      });
    }
  };

  handleBlurBody = () => {
    const { onUpdateNote, selectedNote } = this.props;
    const { body } = this.state;

    if (body !== selectedNote.body) {
      onUpdateNote({
        id: selectedNote.id,
        updates: { body },
      });
    }
  };

  handleEnterTitle = () => {
    const { selectedNote, onEditNoteBody, onSetAddListItem } = this.props;

    if (selectedNote.type === "note") {
      onEditNoteBody();
    } else {
      onSetAddListItem();
    }
  };

  handleClickDone = () => {
    this.props.onCancelEditing();
  };

  renderCardHeader = () => {
    const {
      isEditing,
      selectedNote,
      onConvertNoteToList,
      onDeleteNote,
      onEditNoteTitle,
      onUpdateNote,
    } = this.props;
    const { title } = this.state;

    return (
      <div style={{ display: "flex", borderBottom: "1px solid #2e8486" }}>
        <TextInput
          name="title"
          value={title}
          style={{
            padding: "10px 12px",
            fontWeight: 600,
            flexGrow: 1,
            borderRadius: "3px 3px 0 0",
          }}
          onFocus={onEditNoteTitle}
          onBlur={this.handleBlurTitle}
          onChange={this.handleChangeTitle}
          onEnter={this.handleEnterTitle}
          singleLine
        />
        {!isEditing && (
          <NoteMenu
            selectedNote={selectedNote}
            onConvertNoteToList={onConvertNoteToList}
            onDeleteNote={onDeleteNote}
            onUpdateNote={onUpdateNote}
          />
        )}
      </div>
    );
  };

  renderCardContent = () => {
    const { selectedNote, onEditNoteBody } = this.props;
    const { body } = this.state;

    switch (selectedNote.type) {
      case "list":
        return (
          <div style={{ margin: "7px 12px 10px" }}>
            <ListManager list={selectedNote} />
          </div>
        );

      case "note":
        return (
          <TextInput
            name="body"
            value={body}
            placeholder="Add to this note"
            refCallback={el => { this.bodyField = el; }}
            onChange={this.handleChangeBody}
            onBlur={this.handleBlurBody}
            onFocus={onEditNoteBody}
            minRows={2}
            style={{
              width: "100%",
              padding: "10px 12px 12px",
              borderRadius: "0 0 3px 3px",
            }}
          />
        );

      default:
        return <noscript />
    }
  };

  render () {
    const {
      containerStyle,
      selectedNote,
      isEditing,
    } = this.props;

    return (
      <div style={{
        ...containerStyle,
        padding: "6px 5px",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {selectedNote ? (
            <div style={{
              backgroundColor: "#fff",
              backgroundClip: "padding-box",
              border: "1px solid rgba(0,0,0,0.1)",
              overflow: "hidden",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ flexShrink: 0 }}>
                {this.renderCardHeader()}
              </div>
              <div style={{ flexShrink: 1, overflow: "auto" }}>
                {this.renderCardContent()}
              </div>
            </div>
          ) : (
            <div style={{
              lineHeight: "40px",
              color: "#fff",
              opacity: 0.3,
              textAlign: "center",
            }}>
              Nothing selected
            </div>
          )}
        </div>
        {isEditing && (
          <div style={{
            flexShrink: 0,
            textAlign: "right",
            padding: "5px 1px 0",
          }}>
            <Button
              buttonStyle="ghost"
              onClick={this.handleClickDone}
            >
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
  isEditing: selectors.getIsEditing(state),
  isEditingNoteBody: selectors.getIsEditingNoteBody(state),
});

export default connect(mapStateToProps, {
  onAddNote: actions.requestAddNote,
  onCancelEditing: actions.cancelEditing,
  onConvertNoteToList: actions.requestConvertNoteToList,
  onDeleteNote: actions.requestDeleteNote,
  onEditNoteBody: actions.editNoteBody,
  onEditNoteTitle: actions.editNoteTitle,
  onSetAddListItem: actions.setAddListItem,
  onUpdateNote: actions.requestUpdateNote,
})(Preview);
