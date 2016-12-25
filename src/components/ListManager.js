import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import TextInput from "./TextInput";
import ListItem from "./ListItem";
import Checkbox from "./Checkbox";

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
    const { list, onUpdateListItem, onSetAddListItem, onCancelAddListItem } = this.props;
    const { newItemValue } = this.state;

    return (
      <div style={{ color: "rgba(255,255,255,0.75)" }}>
        {list.items.map(item => (
          <ListItem
            key={item.id}
            isVisible={!list.hideChecked || !item.checked}
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
                refCallback={el => { this.addItemField = el; }}
                value={newItemValue}
                placeholder="+ Add item"
                onChange={this.handleChangeAddItem}
                style={{ flexGrow: 1, marginLeft: -5 }}
                onEnter={this.handleEnterAddItem}
                onBlur={onCancelAddListItem}
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
