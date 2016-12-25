import React, { PropTypes } from "react";
import Textarea from "react-textarea-autosize";

const TextInput = ({ style, ...other}) => (
  <Textarea
    {...other}
    style={{
      display: "block",
      fontFamily: "inherit",
      lineHeight: "inherit",
      fontSize: "inherit",
      color: "inherit",
      resize: "none",
      padding: "3px 5px",
      ...style,
    }}
  />
);

TextInput.propTypes = {
  style: PropTypes.object,
};

export default TextInput;
