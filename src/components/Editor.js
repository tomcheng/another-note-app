import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";

class Editor extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
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
    const { activeNote, onUpdateNote } = this.props;

    onUpdateNote({
      id: activeNote.id,
      updates: { body: target.value }
    });
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
  activeNote: selectors.getActiveNote(state),
  isEditing: selectors.getIsEditing(state),
});

export default connect(mapStateToProps, {
  onUpdateNote: actions.requestUpdateNote,
})(Editor);
