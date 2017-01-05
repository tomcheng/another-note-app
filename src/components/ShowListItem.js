import React, { PropTypes, Component } from "react";
import { withRouter } from "react-router";
import Checkbox from "./Checkbox";

class ListItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired,
    }).isRequired,
    listId: PropTypes.number.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
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

  onClickLabel = () => {
    const { router, listId, item } = this.props;

    router.push("/" + listId + "/edit?focus=item&item_id=" + item.id)
  };

  render () {
    const { item } = this.props;
    return (
      <Checkbox
        label={(
          <span
            onClick={this.onClickLabel}
            style={{
              textDecoration: item.checked ? "line-through" : null,
              opacity: item.checked ? 0.25 : null,
              userSelect: "none",
              padding: "7px 0",
              flexGrow: 1,
            }}
          >
            {item.value}
          </span>
        )}
        checked={item.checked}
        onChange={this.handleChange}
      />
    );
  }
}

export default withRouter(ListItem);
