import React, { PropTypes, Component } from "react";
import moment from "moment";

class Note extends Component {
  static propTypes = {
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
  };

  getTitle = () => {
    const { note } = this.props;

    if (note.type === "list") {
      return note.title +
        " (" + note.items.filter(item => item.checked).length + "/" + note.items.length + ")";
    }

    return note.title;
  };

  getSummary = () => {
    const { note } = this.props;

    if (note.type === "list") {
      const uncheckedItems = note.items.filter(item => !item.checked);

      if (note.items.length === 0) { return "No items"; }
      if (uncheckedItems.length === 0) { return "All done!"; }
      return uncheckedItems[0].value;
    }

    return note.body;
  };

  render () {
    const { note, isVisible, isSelected } = this.props;

    return (
      <div
        style={{
          display: isVisible ? "flex" : "none",
          backgroundColor: isSelected ? "#d5e6e7" : "#fff",
          backgroundClip: "padding-box",
          padding: "0 12px",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 3,
          alignItems: "center",
          whiteSpace: "nowrap",
          height: 50,
        }}
      >
        <div style={{
          fontWeight: 500,
          flexShrink: 1,
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}>
          {this.getTitle()}&nbsp;
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
