import React, { PropTypes, Component } from "react";
import Checkbox from "./Checkbox";

const DEFAULT_LINE_HEIGHT = 22;

class ListItem extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    isVisible: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired,
    }).isRequired,
    listId: PropTypes.number.isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
  };

  handleChange = ({ target }) => {
    const { onUpdateListItem, listId, item } = this.props;
    onUpdateListItem({ listId, itemId: item.id, updates: { checked: target.checked } })
  };

  render () {
    const { item, isVisible, height } = this.props;
    return (
      <div style={{
        padding: ((height - DEFAULT_LINE_HEIGHT) / 2) + "px 0",
        display: isVisible ? "flex" : "none",
        alignItems: "center",
      }}>
        <Checkbox
          label={(
            <span style={{
              textDecoration: item.checked ? "line-through" : null,
              opacity: item.checked ? 0.25 : null,
            }}>
              {item.value}
            </span>
          )}
          checked={item.checked}
          onChange={this.handleChange}
          alignWithText
        />
      </div>
    );
  }
}

export default ListItem;
