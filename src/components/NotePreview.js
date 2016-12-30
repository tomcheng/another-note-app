import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import TextInput from "./TextInput";
import Button from "./Button";
import Card from "./Card";
import PreviewHeader from "./PreviewHeader";
import PreviewFooter from "./PreviewFooter";

class NotePreview extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isEditingNoteBody: PropTypes.bool.isRequired,
    selectedNote: PropTypes.shape({
      body: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    onCancelEditing: PropTypes.func.isRequired,
    onCancelEditNoteBody: PropTypes.func.isRequired,
    onSetEditNoteBody: PropTypes.func.isRequired,
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
    this.setState({ body: target.value });
  };

  handleBlurBody = () => {
    this.props.onCancelEditNoteBody();
  };

  handleEnterTitle = () => {
    this.props.onSetEditNoteBody();
  };

  handleClickCancel = () => {
    const { onCancelEditing, selectedNote } = this.props;

    this.setState({
      body: selectedNote.body,
      title: selectedNote.title,
    });
    onCancelEditing();
  };

  handleClickDone = () => {
    const { selectedNote, onCancelEditing, onUpdateNote } = this.props;

    onUpdateNote({ id: selectedNote.id, updates: this.state });
    onCancelEditing();
  };

  render () {
    const { isEditing, onSetEditNoteBody } = this.props;
    const { title, body } = this.state;

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
          padding: "0 5px 6px",
        }}>
          <Card
            header={(
              <PreviewHeader
                title={title}
                onChangeTitle={this.handleChangeTitle}
                onEnter={this.handleEnterTitle}
              />
            )}
            body={(
              <TextInput
                name="body"
                value={body}
                placeholder="Add to this note"
                refCallback={el => { this.bodyField = el; }}
                onChange={this.handleChangeBody}
                onBlur={this.handleBlurBody}
                onFocus={onSetEditNoteBody}
                minRows={2}
                style={{
                  width: "100%",
                  padding: "10px 12px 12px",
                  borderRadius: "0 0 3px 3px",
                }}
              />
            )}
          />
        </div>
        {isEditing && (
          <div style={{ flexShrink: 0 }}>
            <PreviewFooter>
              <Button
                buttonStyle="link"
                style={{
                  marginRight: 10,
                  opacity: 0.8,
                }}
                onClick={this.handleClickCancel}
              >
                Cancel
              </Button>
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
  onCancelEditing: actions.cancelEditing,
  onCancelEditNoteBody: actions.cancelEditNoteBody,
  onSetEditNoteBody: actions.setEditNoteBody,
  onUpdateNote: actions.requestUpdateNote,
})(NotePreview);
