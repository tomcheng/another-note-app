import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import ListItem from "./ListItem";

class ListManager extends Component {
  static propTypes = {
    list: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    onAddListItem: PropTypes.func.isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
  };

  state = {
    newItemValue: "",
  };

  handleChangeAddItem = ({ target }) => {
    this.setState({ newItemValue: target.value });
  };

  handleKeyDownAddItem = evt => {
    const { onAddListItem, list } = this.props;
    const { newItemValue } = this.state;

    if (evt.key === "Enter") {
      this.setState({ newItemValue: "" });
      onAddListItem({ listId: list.id, value: newItemValue });
    }
  };

  render () {
    const { list, onUpdateListItem } = this.props;
    const { newItemValue } = this.state;

    return (
      <div>
        {list.items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            listId={list.id}
            onUpdateListItem={onUpdateListItem}
          />
        ))}
        <input
          value={newItemValue}
          type="text"
          placeholder="Add item"
          onChange={this.handleChangeAddItem}
          onKeyDown={this.handleKeyDownAddItem}
        />
      </div>
    );
  }
}

export default connect(null, {
  onAddListItem: actions.requestAddListItem,
  onUpdateListItem: actions.requestUpdateListItem,
})(ListManager);
