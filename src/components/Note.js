import React, { PropTypes, Component } from "react";
import moment from "moment";
import colors from "../styles/colors";
import FancyIcon from "./FancyIcon";

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
      const remaining = totalItems - completedItems;
      return note.title + " (" + (remaining ? remaining + " left" : "done") + ")";
    }

    return note.title;
  };

  getSummary = () => {
    const { note } = this.props;

    if (note.type === "list") {
      return note.uncheckedItems.map(item => item.value).join(", ");
    }

    return note.body;
  };

  getUpdatedAt = () => {
    const { note } = this.props;

    if (moment().isSame(note.updatedAt, "day")) {
      return moment(note.updatedAt).fromNow()
    }

    if (moment().subtract(1, "days").isSame(note.updatedAt, "day")) {
      return "Yesterday at " + moment(note.updatedAt).format("h:mma");
    }

    return moment(note.updatedAt).format("MMM D, YYYY");
  };

  render () {
    const { note, isVisible, isSelected } = this.props;
    const summary = this.getSummary();

    return (
      <div
        style={{
          display: isVisible ? "flex" : "none",
          backgroundColor: isSelected ? "#d5e6e7" : "#fff",
          backgroundClip: "padding-box",
          padding: "0 8px",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 3,
          alignItems: "center",
          whiteSpace: "nowrap",
          height: 50,
        }}
      >
        <div style={{ marginRight: 5, opacity: 0.8 }}>
          <FancyIcon icon={note.type} color="#222" />
        </div>
        <div style={{
          fontWeight: 500,
          flexShrink: 1,
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}>
          {this.getTitle()}&nbsp;
        </div>
        {summary.trim() !== "" ? (
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
        ) : (
          <div style={{ flexGrow: 1 }} />
        )}
        {note.pinned && (
          <div style={{ marginRight: 5, opacity: 0.8 }}>
            <FancyIcon icon="pin" color={colors.yellow} />
          </div>
        )}
        {!note.pinned && (
          <div style={{
            fontSize: 12,
            opacity: 0.3,
          }}>
            {this.getUpdatedAt()}
          </div>
        )}
      </div>
    );
  }
}

export default Note;
