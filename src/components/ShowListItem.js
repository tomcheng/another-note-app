import React, { PropTypes, Component } from "react";
import Checkbox from "./Checkbox";


class ListItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired,
    }).isRequired,
    listId: PropTypes.number.isRequired,
    onCheckListItem: PropTypes.func.isRequired,
    onUncheckListItem: PropTypes.func.isRequired,
  };

  handleChange = ({ target }) => {
    const { onCheckListItem, onUncheckListItem, listId, item } = this.props;

    if (target.checked) {
      onCheckListItem({ listId, itemId: item.id });
    } else {
      onUncheckListItem({ listId, itemId: item.id });
    }
  };

  render () {
    const { item } = this.props;
    return (
      <Checkbox
        label={(
          <span style={{
            textDecoration: item.checked ? "line-through" : null,
            opacity: item.checked ? 0.25 : null,
            userSelect: "none",
            padding: "7px 0",
          }}>
            {item.value}
          </span>
        )}
        checked={item.checked}
        onChange={this.handleChange}
      />
    );
  }
}

export default ListItem;
