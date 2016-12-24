import React, { PropTypes } from "react";

const Button = ({ buttonStyle, onClick, children }) => {
  let styles = {};

  switch (buttonStyle) {
    case "link":
      styles = {
        backgroundColor: "transparent",
        color: "inherit",
      };
      break;
    case "danger":
      styles = {
        backgroundColor: "#f95d61",
        color: "#fff",
      };
      break;
    default:
      break;
  }

  return (
    <button
      onClick={onClick}
      style={{
        ...styles,
        height: 40,
        padding: "0 12px",
        border: 0,
        borderRadius: 2,
      }}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  buttonStyle: PropTypes.oneOf(["link", "danger"]).isRequired,
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func,
};

export default Button;
