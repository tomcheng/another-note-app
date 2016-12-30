import React, { PropTypes } from "react";

const Card = ({ header, body }) => (
  <div style={{
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    border: "1px solid rgba(0,0,0,0.1)",
    overflow: "hidden",
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
  }}>
    <div style={{ flexShrink: 0, borderBottom: "1px solid #2e8486" }}>
      {header}
    </div>
    <div style={{ flexShrink: 1, overflow: "auto" }}>
      {body}
    </div>
  </div>
);

Card.propTypes = {
  header: PropTypes.element.isRequired,
  body: PropTypes.element.isRequired,
};

export default Card;
