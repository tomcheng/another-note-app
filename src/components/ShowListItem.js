import PropTypes from "prop-types";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AnimateHeight from "./AnimateHeight";
import Checkbox from "./Checkbox";

class ListItem extends Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired
    }).isRequired,
    listId: PropTypes.number.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    onCheckListItem: PropTypes.func,
    onUncheckListItem: PropTypes.func
  };

  state = { isPendingCheck: false };

  componentDidUpdate(prevProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.container.focus();
    }
  }

  handleChange = ({ target }) => {
    const { onUncheckListItem, listId, item } = this.props;

    if (this.state.isPendingCheck) {
      return;
    }

    if (target.checked) {
      this.setState({ isPendingCheck: true });
      setTimeout(() => {
        this.actuallyCheckItem();
      }, 400);
    } else {
      onUncheckListItem({ listId, itemId: item.id });
    }
  };

  actuallyCheckItem = () => {
    const { onCheckListItem, listId, item } = this.props;

    onCheckListItem({ listId, itemId: item.id });
  };

  onClickLabel = () => {
    const { onUncheckListItem, history, listId, item } = this.props;

    if (!item.checked) {
      history.push("/" + listId + "/edit?focus=item&item_id=" + item.id);
    } else {
      onUncheckListItem({ listId, itemId: item.id });
    }
  };

  render() {
    const { item } = this.props;
    const { isPendingCheck } = this.state;
    const seemsChecked = item.checked || isPendingCheck;

    return (
      <div
        tabIndex={0}
        ref={el => {
          this.container = el;
        }}
      >
        {/* Wrap in div so AnimateHeight doesn't affect reordering animation */}
        <AnimateHeight isExpanded={!isPendingCheck} delay={250} duration={150}>
          <Checkbox
            label={
              <span
                onClick={this.onClickLabel}
                style={{
                  textDecoration: seemsChecked ? "line-through" : null,
                  opacity: seemsChecked ? 0.25 : null,
                  userSelect: "none",
                  padding: "7px 0",
                  flexGrow: 1
                }}
              >
                {item.value}
              </span>
            }
            checked={seemsChecked}
            onChange={this.handleChange}
          />
        </AnimateHeight>
      </div>
    );
  }
}

export default withRouter(ListItem);
