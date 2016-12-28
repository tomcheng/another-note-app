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
    addItemValue: PropTypes.string.isRequired,
    onAddListItem: PropTypes.func.isRequired,
    onCancelAddListItem: PropTypes.func.isRequired,
    onCancelEditing: PropTypes.func.isRequired,
    onChangeAddItem: PropTypes.func.isRequired,
    onClearAddItem: PropTypes.func.isRequired,
    onSetAddListItem: PropTypes.func.isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
  };

  componentDidMount () {
    if (this.props.isAddingListItem) {
      this.addItemField.focus();
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props.isAddingListItem);
    if (!this.props.isAddingListItem && nextProps.isAddingListItem) {
      setTimeout(() => {
        this.addItemField.focus();
      }, 0);
    }
  }

  handleEnterAddItem = () => {
    const { onAddListItem, list, onCancelEditing, addItemValue, onClearAddItem } = this.props;

    if (addItemValue.trim() === "") {
      this.addItemField.blur();
      onCancelEditing();
      return;
    }

    onAddListItem({ listId: list.id, value: addItemValue });
    onClearAddItem();
  };

  handleBlurAddItem = () => {
    this.props.onCancelAddListItem();
  };

  render () {
    const {
      list,
      addItemValue,
      onChangeAddItem,
      onSetAddListItem,
      onUpdateListItem,
    } = this.props;

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
                value={addItemValue}
                placeholder="+ Add item"
                onChange={onChangeAddItem}
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
  onCancelEditing: actions.cancelEditing,
  onSetAddListItem: actions.setAddListItem,
  onUpdateListItem: actions.requestUpdateListItem,
})(ListManager);
