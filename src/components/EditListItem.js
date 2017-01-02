import React, { PropTypes, Component } from "react";
import TextInput from "./TextInput";
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
            <TextInput
              style={{ flexGrow: 1, marginLeft: -5 }}
              value={value}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              singleLine
            />
          )}
          disabled
        />
      </div>
    );
  }
}

export default EditListItem;
