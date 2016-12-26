import React, { PropTypes } from "react";
import "./Checkbox.css";

const Checkbox = ({ checked, label, onChange, disabled, alignWithText }) => (
  <label className={alignWithText ? "CheckboxLabelText" : "CheckboxLabel"}>
    <input
      className={alignWithText ? "CheckboxInputText" : "CheckboxInput"}
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
  alignWithText: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;
