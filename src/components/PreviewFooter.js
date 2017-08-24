import PropTypes from 'prop-types';
import React from "react";

const PreviewFooter = ({ children }) => (
  <div style={{
    textAlign: "right",
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
    borderTop: "1px solid rgba(0,0,0,0.15)",
    color: "#fff",
  }}>
    {children}
  </div>
);

PreviewFooter.propTypes = {
  children: PropTypes.any.isRequired,
};

export default PreviewFooter;
