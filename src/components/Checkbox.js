import React, { PropTypes, Component } from "react";
import FancyIcon from "./FancyIcon";

class Checkbox extends Component {
  handleClick = () => {
    const { checked, onChange } = this.props;

    onChange({ target: { checked: !checked } });
  };

  render () {
    const { checked, label, disabled } = this.props;

    return (
      <label
        onClick={this.handleClick}
        style={{ width: "100%", display: "flex" }}
      >
        <div style={{ position: "relative", top: 6, marginRight: 6, opacity: disabled ? 0.2 : 0.8 }}>
          {checked ? (
              <FancyIcon icon="checked" />
            ) : (
              <FancyIcon icon="unchecked" />
            )}
        </div>
        {label}
      </label>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;
