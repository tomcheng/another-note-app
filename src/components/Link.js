import React, { PropTypes } from "react";
import { Link as RRLink } from "react-router";

const Link = ({ children, ...other }) => (
  <RRLink {...other} onContextMenu={e => { e.preventDefault(); }}>
    {children}
  </RRLink>
);

Link.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Link;
