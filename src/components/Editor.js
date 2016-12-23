import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Textarea from "react-textarea-autosize";

class Editor extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    onBlurEdit: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      body: PropTypes.string,
    }),
  };

  componentWillReceiveProps (nextProps) {
    if (!this.props.isEditing && nextProps.isEditing) {
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
    const { selectedNote, onBlurEdit } = this.props;

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
          onBlur={onBlurEdit}
          style={{
            display: "block",
            fontFamily: "inherit",
            lineHeight: "inherit",
            fontSize: "inherit",
            color: "inherit",
            padding: "2px 5px 5px",
            margin: "0 5px 10px",
            width: "100%",
            resize: "none",
            border: "0",
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedNote: selectors.getSelectedNote(state),
  isEditing: selectors.getIsEditing(state),
});

export default connect(mapStateToProps, {
  onBlurEdit: actions.blurEdit,
  onUpdateNote: actions.requestUpdateNote,
})(Editor);
