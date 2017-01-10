import React, { PropTypes, Component } from "react";
import withRouter from "../utils/withRouter";
import AnimateHeight from "./AnimateHeight";
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
      transitionTo: PropTypes.func.isRequired,
    }).isRequired,
    onCheckListItem: PropTypes.func,
    onUncheckListItem: PropTypes.func,
  };

  state = { isPendingCheck: false };

  handleChange = ({ target }) => {
    const { onUncheckListItem, listId, item } = this.props;

    if (this.state.isPendingCheck) { return; }

    if (target.checked) {
      this.setState({ isPendingCheck: true });
      setTimeout(() => { this.actuallyCheckItem(); }, 400);
    } else {
      onUncheckListItem({ listId, itemId: item.id });
    }
  };

  actuallyCheckItem = () => {
    const { onCheckListItem, listId, item } = this.props;

    onCheckListItem({ listId, itemId: item.id });
  };

  onClickLabel = () => {
    const { onUncheckListItem, router, listId, item } = this.props;

    if (!item.checked) {
      router.transitionTo("/" + listId + "/edit?focus=item&item_id=" + item.id);
    } else {
      onUncheckListItem({ listId, itemId: item.id });
    }
  };

  render () {
    const { item } = this.props;
    const { isPendingCheck } = this.state;
    const seemsChecked = item.checked || isPendingCheck;

    return (
      <div>{/* Wrap in div so AnimateHeight doesn't affect reordering animation */}
        <AnimateHeight
          isExpanded={!isPendingCheck}
          delay={250}
          duration={150}
        >
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
        </AnimateHeight>
      </div>
    );
  }
}

export default withRouter(ListItem);
