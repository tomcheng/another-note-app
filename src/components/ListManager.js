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
    onUpdateListItem: PropTypes.func.isRequired,
  };

  render () {
    const { list, onUpdateListItem } = this.props;
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
      </div>
    );
  }
}

export default connect(null, {
  onUpdateListItem: actions.requestUpdateListItem,
})(ListManager);
