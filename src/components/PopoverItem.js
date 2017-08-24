import PropTypes from 'prop-types';
import React from "react";

const PopoverItem = ({ onClick, children }) => (
  <div
    style={{
      height: 42,
      lineHeight: "42px",
      padding: "0 25px 0 18px",
      whiteSpace: "nowrap",
    }}
    onClick={onClick}
  >
    {children}
  </div>
);

PopoverItem.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PopoverItem;
