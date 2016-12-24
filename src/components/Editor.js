import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Textarea from "react-textarea-autosize";

class Editor extends Component {
  static propTypes = {
    isEditingNoteBody: PropTypes.bool.isRequired,
    onCancelEditNoteBody: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
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

  render () {
    const { selectedNote, onCancelEditNoteBody, isEditingNoteBody } = this.props;

    if (!selectedNote) { return <noscript />; }

    return (
      <div style={{
        borderTop: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}>
        <input
          value={selectedNote.title}
          style={{
            padding: "0 5px",
            margin: "5px 5px 0",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "30px",
            border: 0,
          }}
          onChange={this.handleChangeTitle}
        />
        <Textarea
          placeholder="Add to this note"
          value={selectedNote.body}
          ref={el => { this.textarea = el; }}
          onChange={this.handleChangeBody}
          onBlur={onCancelEditNoteBody}
          minRows={3}
          style={{
            display: "block",
            fontFamily: "inherit",
            lineHeight: "inherit",
            fontSize: "inherit",
            color: "inherit",
            padding: "2px 5px 5px",
            margin: "0 5px 5px",
            resize: "none",
            border: "0",
          }}
        />
        {isEditingNoteBody && (
          <button>Done</button>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedNote: selectors.getSelectedNote(state),
  isEditingNoteBody: selectors.getIsEditingNoteBody(state),
});

export default connect(mapStateToProps, {
  onCancelEditNoteBody: actions.cancelEditNoteBody,
  onUpdateNote: actions.requestUpdateNote,
})(Editor);
