import React, { PropTypes } from "react";
import "./Checkbox.css";

const Checkbox = ({ checked, label, onChange, disabled, alignWithText, alignWithTextInput }) => (
  <label className={alignWithText ? "CheckboxLabelText"
    : alignWithTextInput ? "CheckboxLabelInput"
    : "CheckboxLabel"}>
    <input
      className={alignWithText ? "CheckboxInputText"
        : alignWithTextInput ? "CheckboxInputInput"
        : "CheckboxInput"}
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
  alignWithTextInput: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;
