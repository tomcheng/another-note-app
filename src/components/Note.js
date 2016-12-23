import React, { PropTypes, Component } from "react";
import moment from "moment";

class Note extends Component {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    note: PropTypes.shape({
      body: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }).isRequired,
    onSelectNote: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { note, onSelectNote } = this.props;

    onSelectNote({ id: note.id });
  };

  render () {
    const { note, isSelected, isVisible } = this.props;

    return (
      <div
        onClick={this.handleClick}
        style={{
          backgroundColor: isSelected ? "#ddd" : null,
          display: isVisible ? "block" : "none",
        }}
      >
        {note.title} - {note.body} - {moment(note.updatedAt).fromNow()}
      </div>
    );
  }
}

export default Note;
