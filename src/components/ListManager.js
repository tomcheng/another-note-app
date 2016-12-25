import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import TextInput from "./TextInput";
import ListItem from "./ListItem";
import Checkbox from "./Checkbox";

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

  handleEnterAddItem = () => {
    const { onAddListItem, list } = this.props;
    const { newItemValue } = this.state;

    this.setState({ newItemValue: "" });

    onAddListItem({ listId: list.id, value: newItemValue });
  };

  render () {
    const { list, onUpdateListItem } = this.props;
    const { newItemValue } = this.state;

    return (
      <div style={{ color: "rgba(255,255,255,0.75)" }}>
        {list.items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            listId={list.id}
            onUpdateListItem={onUpdateListItem}
          />
        ))}
        <div style={{ height: 40, display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={false}
            label={(
              <TextInput
                value={newItemValue}
                placeholder="+ Add item"
                onChange={this.handleChangeAddItem}
                style={{ flexGrow: 1, marginLeft: -5 }}
                singleLine
                onEnter={this.handleEnterAddItem}
              />
            )}
            disabled
          />
        </div>
      </div>
    );
  }
}

export default connect(null, {
  onAddListItem: actions.requestAddListItem,
  onUpdateListItem: actions.requestUpdateListItem,
})(ListManager);
