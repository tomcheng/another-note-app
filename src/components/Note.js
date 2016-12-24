import React, { PropTypes, Component } from "react";
import moment from "moment";

class Note extends Component {
  static propTypes = {
    isFaded: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    note: PropTypes.shape({
      body: PropTypes.string,
      id: PropTypes.number.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
      })),
      title: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }).isRequired,
    onDeselectNote: PropTypes.func.isRequired,
    onSelectNote: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { note, isSelected, onSelectNote, onDeselectNote } = this.props;

    if (isSelected) {
      onDeselectNote();
    } else {
      onSelectNote({ id: note.id });
    }
  };

  getSummary = () => {
    const { note } = this.props;

    if (note.type === "list") {
      return note.items.map(item => item.value).join(" ");
    }

    return note.body;
  };

  render () {
    const { note, isVisible, isFaded } = this.props;

    return (
      <div
        onClick={this.handleClick}
        style={{
          display: isVisible ? "flex" : "none",
          backgroundColor: "#fff",
          backgroundClip: "padding-box",
          opacity: isFaded ? 0.3 : 1,
          transition: "opacity 0.1s ease-in-out",
          alignItems: "center",
          padding: "0 12px",
          whiteSpace: "nowrap",
          border: "1px solid rgba(0,0,0,0.03)",
          borderRadius: 2,
          margin: "1px 2px",
          height: 48,
        }}
      >
        <div style={{
          fontWeight: 500,
          flexShrink: 1,
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}>
          {note.title}&nbsp;
        </div>
        <div style={{
          flexGrow: 1,
          flexShrink: 1000000,
          opacity: 0.3,
          textOverflow: "ellipsis",
          overflow: "hidden",
          paddingRight: 10,
        }}>
          &ndash; {this.getSummary()}
        </div>
        <div style={{
          fontSize: 12,
          opacity: 0.3,
        }}>
          {moment(note.updatedAt).fromNow()}
        </div>
      </div>
    );
  }
}

export default Note;
