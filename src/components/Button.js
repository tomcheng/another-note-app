import React, { PropTypes } from "react";

const Button = ({ buttonStyle, onClick, children, style, disabled }) => {
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
    case "ghost":
      styles = {
        backgroundColor: "transparent",
        color: "rgba(255,255,255,0.8)",
        border: "1px solid rgba(255,255,255,0.7)",
      };
      break;
    case "outline":
      styles = {
        backgroundColor: "transparent",
        color: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(0,0,0,0.2)",
      };
      break;
    default:
      break;
  }

  return (
    <button
      onClick={onClick}
      style={{
        height: 40,
        padding: "0 12px",
        border: 0,
        borderRadius: 3,
        opacity: disabled ? 0.4 : null,
        ...styles,
        ...style,
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  buttonStyle: PropTypes.oneOf(["link", "danger", "ghost", "outline"]).isRequired,
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default Button;
