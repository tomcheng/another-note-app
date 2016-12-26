import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import TextInput from "./TextInput";
import ListItem from "./ListItem";
import Checkbox from "./Checkbox";

const LIST_HEIGHT = 36;

class ListManager extends Component {
  static propTypes = {
    isAddingListItem: PropTypes.bool.isRequired,
    list: PropTypes.shape({
      hideChecked: PropTypes.bool.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        checked: PropTypes.bool.isRequired,
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    onAddListItem: PropTypes.func.isRequired,
    onCancelAddListItem: PropTypes.func.isRequired,
    onSetAddListItem: PropTypes.func.isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
  };

  state = {
    newItemValue: "",
  };

  componentDidMount () {
    if (this.props.isAddingListItem) {
      this.addItemField.focus();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.isAddingListItem && nextProps.isAddingListItem) {
      setTimeout(() => {
        this.addItemField.focus();
      }, 0);
    }
  }

  handleChangeAddItem = ({ target }) => {
    this.setState({ newItemValue: target.value });
  };

  handleEnterAddItem = () => {
    const { onAddListItem, list } = this.props;
    const { newItemValue } = this.state;

    if (newItemValue.trim() === "") {
      this.addItemField.blur();
      return;
    }

    this.setState({ newItemValue: "" });

    onAddListItem({ listId: list.id, value: newItemValue });
  };

  handleBlurAddItem = () => {
    const { onCancelAddListItem, onAddListItem, list } = this.props;
    const { newItemValue } = this.state;

    onCancelAddListItem();

    if (newItemValue.trim() === "") { return; }

    this.setState({ newItemValue: "" });

    onAddListItem({ listId: list.id, value: newItemValue });
  };

  render () {
    const { list, onUpdateListItem, onSetAddListItem } = this.props;
    const { newItemValue } = this.state;

    return (
      <div>
        {list.items.map(item => (
          <ListItem
            height={LIST_HEIGHT}
            key={item.id}
            isVisible={!list.hideChecked || !item.checked}
            item={item}
            listId={list.id}
            onUpdateListItem={onUpdateListItem}
          />
        ))}
        <div style={{ height: LIST_HEIGHT, display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={false}
            label={(
              <TextInput
                refCallback={el => { this.addItemField = el; }}
                value={newItemValue}
                placeholder="+ Add item"
                onChange={this.handleChangeAddItem}
                style={{ flexGrow: 1, marginLeft: -5 }}
                onEnter={this.handleEnterAddItem}
                onBlur={this.handleBlurAddItem}
                onFocus={onSetAddListItem}
                singleLine
              />
            )}
            disabled
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAddingListItem: selectors.getIsAddingListItem(state),
});

export default connect(mapStateToProps, {
  onAddListItem: actions.requestAddListItem,
  onCancelAddListItem: actions.cancelAddListItem,
  onSetAddListItem: actions.setAddListItem,
  onUpdateListItem: actions.requestUpdateListItem,
})(ListManager);
