import PropTypes from 'prop-types';
import React, { Component } from "react";
import TextInput from "./TextInput";
import FancyIcon from "./FancyIcon";
import Checkbox from "./Checkbox";

class EditListItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      checked: PropTypes.bool.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    listId: PropTypes.number.isRequired,
    refCallback: PropTypes.func.isRequired,
    onDeleteListItem: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      value: props.item.value,
      isFocused: false,
    };
  }

  componentWillUnmount () {
    clearTimeout(this.focusedTimer);
  };

  handleChange = ({ target }) => {
    this.setState({ value: target.value });
  };

  handleBlur = event => {
    const { onUpdateListItem, listId, item, onBlur } = this.props;

    onUpdateListItem({ listId, itemId: item.id, updates: this.state });

    this.focusedTimer = setTimeout(() => { this.setState({ isFocused: false }); }, 50);

    onBlur(event);
  };

  handleFocus = () => {
    this.setState({ isFocused: true });

    this.props.onFocus();
  };

  handleClickDelete = () => {
    const { onDeleteListItem, listId, item } = this.props;

    onDeleteListItem({ listId, itemId: item.id });
  };

  render () {
    const { item, refCallback } = this.props;
    const { value, isFocused } = this.state;

    return (
      <Checkbox
        checked={item.checked}
        label={(
          <div style={{ flexGrow: 1, display: "flex", padding: "2px 0" }}>
            <TextInput
              style={{ flexGrow: 1, marginLeft: -5 }}
              value={value}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
              refCallback={refCallback}
              singleLine
            />
            {isFocused && (
              <div onClick={this.handleClickDelete} style={{ padding: 4 }}>
                <FancyIcon icon="trash" color="#222" />
              </div>
            )}
          </div>
        )}
        disabled
      />
    );
  }
}

export default EditListItem;
