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
          backgroundColor: isSelected ? "#fcfcd4" : null,
          height: 40,
          display: isVisible ? "flex" : "none",
          alignItems: "center",
          padding: "0 10px",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ paddingRight: 8 }}>
          {note.title}
        </div>
        <div style={{
          flexGrow: 1,
          flexShrink: 1,
          opacity: 0.3,
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}>
          {note.body}
        </div>
        <div style={{
          fontSize: 11,
          opacity: 0.3,
        }}>
          {moment(note.updatedAt).fromNow()}
        </div>
      </div>
    );
  }
}

export default Note;
