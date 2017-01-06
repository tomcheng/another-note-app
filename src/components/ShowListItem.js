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

  state = { isPendingCheck: false };

  handleChange = ({ target }) => {
    const { onUncheckListItem, listId, item } = this.props;

    if (this.state.isPendingCheck) { return; }

    if (target.checked) {
      this.setState({ isPendingCheck: true });
      setTimeout(() => { this.actuallyCheckItem(); }, 250);
    } else {
      onUncheckListItem({ listId, itemId: item.id });
    }
  };

  actuallyCheckItem = () => {
    const { onCheckListItem, listId, item } = this.props;

    onCheckListItem({ listId, itemId: item.id });
  };

  onClickLabel = () => {
    const { router, listId, item } = this.props;

    router.push("/" + listId + "/edit?focus=item&item_id=" + item.id)
  };

  render () {
    const { item } = this.props;
    const { isPendingCheck } = this.state;
    const seemsChecked = item.checked || isPendingCheck;

    return (
      <Checkbox
        label={(
          <span
            onClick={this.onClickLabel}
            style={{
              textDecoration: seemsChecked ? "line-through" : null,
              opacity: seemsChecked ? 0.25 : null,
              userSelect: "none",
              padding: "7px 0",
              flexGrow: 1,
            }}
          >
            {item.value}
          </span>
        )}
        checked={seemsChecked}
        onChange={this.handleChange}
      />
    );
  }
}

export default withRouter(ListItem);
