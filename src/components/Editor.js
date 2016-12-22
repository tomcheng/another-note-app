import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { getActiveNote, getIsEditing, updateNoteBody } from "../reducer";

class Editor extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    onUpdateNoteBody: PropTypes.func.isRequired,
    activeNote: PropTypes.shape({
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

  handleChange = ({ target }) => {
    const { activeNote, onUpdateNoteBody } = this.props;

    onUpdateNoteBody({ id: activeNote.id, body: target.value });
  };

  render () {
    const { activeNote } = this.props;

    return activeNote ? (
      <textarea
        value={activeNote.body}
        ref={el => { this.textarea = el; }}
        onChange={this.handleChange}
      />
    ) : (
      <div>No note selected</div>
    );
  }
}

const mapStateToProps = state => ({
  activeNote: getActiveNote(state),
  isEditing: getIsEditing(state),
});

export default connect(mapStateToProps, {
  onUpdateNoteBody: updateNoteBody,
})(Editor);
