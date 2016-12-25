import React, { PropTypes } from "react";
import "./Checkbox.css";

const Checkbox = ({ checked, label, onChange, disabled }) => (
  <label className="CheckboxLabel">
    <input
      className="CheckboxInput"
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    {label}
  </label>
);

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;
