import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import PreviewFooter from "./PreviewFooter";
import TextInput from "./TextInput";
import Button from "./Button";
import NoteMenu from "./NoteMenu";
import ListManager from "./ListManager";

class ListPreview extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    selectedNote: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    onAddNote: PropTypes.func.isRequired,
    onCancelEditing: PropTypes.func.isRequired,
    onConvertNoteToList: PropTypes.func.isRequired,
    onEditNoteTitle: PropTypes.func.isRequired,
    onSetAddListItem: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    const { selectedNote } = props;

    this.state = {
      title: selectedNote.title,
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.selectedNote !== nextProps.selectedNote) {
      this.setState({
        title: nextProps.selectedNote.title,
      });
    }
  }

  handleChangeTitle = ({ target }) => {
    this.setState({ title: target.value });
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

  handleEnterTitle = () => {
    const { onSetAddListItem } = this.props;

    onSetAddListItem();
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
    const { selectedNote } = this.props;

    return (
      <div style={{ margin: "7px 12px 10px" }}>
        <ListManager list={selectedNote} />
      </div>
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
});

export default connect(mapStateToProps, {
  onAddNote: actions.requestAddNote,
  onCancelEditing: actions.cancelEditing,
  onConvertNoteToList: actions.requestConvertNoteToList,
  onDeleteNote: actions.requestDeleteNote,
  onEditNoteTitle: actions.editNoteTitle,
  onSetAddListItem: actions.setAddListItem,
  onUpdateNote: actions.requestUpdateNote,
})(ListPreview);
