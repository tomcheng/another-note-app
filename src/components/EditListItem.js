import React, { PropTypes, Component } from "react";
import TextInput from "./TextInput";
import Icon from "./Icon";
import Checkbox from "./Checkbox";

class EditListItem extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    isVisible: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      checked: PropTypes.bool.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    listId: PropTypes.number.isRequired,
    onDeleteListItem: PropTypes.func.isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = { value: props.item.value };
  }

  handleChange = ({ target }) => {
    this.setState({ value: target.value });
  };

  handleBlur = () => {
    const { onUpdateListItem, listId, item } = this.props;

    onUpdateListItem({ listId, itemId: item.id, updates: this.state });
  };

  handleClickDelete = () => {
    const { onDeleteListItem, listId, item } = this.props;

    onDeleteListItem({ listId, itemId: item.id });
  };

  render () {
    const { item, isVisible, height } = this.props;
    const { value } = this.state;

    return (
      <div style={{
        display: isVisible ? "flex" : "none",
        alignItems: "center",
        height,
      }}>
        <Checkbox
          checked={item.checked}
          label={(
            <div style={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <TextInput
                style={{ flexGrow: 1, marginLeft: -5 }}
                value={value}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                singleLine
              />
              <Icon
                onClick={this.handleClickDelete}
                icon="trash-o"
                action
              />
            </div>
          )}
          disabled
        />
      </div>
    );
  }
}

export default EditListItem;