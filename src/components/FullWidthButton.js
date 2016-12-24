import React, { PropTypes } from "react";

const FullWidthButton = ({ children, onClick }) => (
  <button
    style={{
      border: 0,
      textAlign: "center",
      backgroundColor: "#2dbaa6",
      color: "#fff",
      height: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    }}
    onClick={onClick}
  >
    {children}
  </button>
);

FullWidthButton.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func,
};

export default FullWidthButton;
