import React, { PropTypes, Component } from "react";
import moment from "moment";

class Note extends Component {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    note: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      body: PropTypes.string,
      checkedItems: PropTypes.array,
      unCheckedItems: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
      })),
    }).isRequired,
  };

  getTitle = () => {
    const { note } = this.props;

    if (note.type === "list") {
      const totalItems = note.checkedItems.length + note.uncheckedItems.length;
      const completedItems = note.checkedItems.length;
      return note.title +
        " (" + completedItems + "/" + totalItems + ")";
    }

    return note.title;
  };

  getSummary = () => {
    const { note } = this.props;

    if (note.type === "list") {
      if (note.checkedItems.length + note.uncheckedItems.length === 0 ) { return "No items"; }
      if (note.uncheckedItems.length === 0) { return "All done!"; }
      return note.uncheckedItems[0].value;
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
