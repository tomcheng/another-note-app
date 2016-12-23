import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";

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

  handleChange = ({ target }) => {
    const { selectedNote, onUpdateNote } = this.props;

    onUpdateNote({
      id: selectedNote.id,
      updates: { body: target.value }
    });
  };

  render () {
    const { selectedNote, onBlurEdit } = this.props;

    return selectedNote ? (
      <textarea
        value={selectedNote.body}
        ref={el => { this.textarea = el; }}
        onChange={this.handleChange}
        onBlur={onBlurEdit}
      />
    ) : (
      <div>No note selected</div>
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
