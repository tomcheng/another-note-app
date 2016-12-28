import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import PreviewFooter from "./PreviewFooter";
import TextInput from "./TextInput";
import Button from "./Button";
import NoteMenu from "./NoteMenu";

class NotePreview extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isEditingNoteBody: PropTypes.bool.isRequired,
    selectedNote: PropTypes.shape({
      body: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    onAddNote: PropTypes.func.isRequired,
    onCancelEditing: PropTypes.func.isRequired,
    onEditNoteBody: PropTypes.func.isRequired,
    onEditNoteTitle: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    const { selectedNote } = props;

    this.state = {
      body: selectedNote.body,
      title: selectedNote.title,
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
        body: nextProps.selectedNote.body,
        title: nextProps.selectedNote.title,
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
    this.props.onEditNoteBody();
  };

  handleClickDone = () => {
    this.props.onCancelEditing();
  };

  renderCardHeader = () => {
    const {
      isEditing,
      onEditNoteTitle,
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
          <NoteMenu />
        )}
      </div>
    );
  };

  renderCardContent = () => {
    const { onEditNoteBody } = this.props;
    const { body } = this.state;

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
  };

  render () {
    const { isEditing } = this.props;

    return (
      <div style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          padding: "6px 5px",
        }}>
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
        </div>
        {isEditing && (
          <div style={{ flexShrink: 0 }}>
            <PreviewFooter>
              <Button
                buttonStyle="ghost"
                onClick={this.handleClickDone}
              >
                Done
              </Button>
            </PreviewFooter>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isEditing: selectors.getIsEditing(state),
  isEditingNoteBody: selectors.getIsEditingNoteBody(state),
});

export default connect(mapStateToProps, {
  onAddNote: actions.requestAddNote,
  onCancelEditing: actions.cancelEditing,
  onEditNoteBody: actions.editNoteBody,
  onEditNoteTitle: actions.editNoteTitle,
  onUpdateNote: actions.requestUpdateNote,
})(NotePreview);
