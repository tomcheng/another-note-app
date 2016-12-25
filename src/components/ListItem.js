import React, { PropTypes, Component } from "react";
import "./ListItem.css";

class ListItem extends Component {
  static propTypes = {
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
    const { item } = this.props;
    return (
      <div style={{
        height: 40,
        display: "flex",
        alignItems: "center",
      }}>
        <label className="ListItemLabel">
          <input
            className="ListItemInput"
            type="checkbox"
            checked={item.checked}
            onChange={this.handleChange}
          />
          <span style={{
            textDecoration: item.checked ? "line-through" : null,
            opacity: item.checked ? 0.25 : null,
          }}>
            {item.value}
          </span>
        </label>
      </div>
    );
  }
}

export default ListItem;
