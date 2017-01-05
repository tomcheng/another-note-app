import React, { PropTypes } from "react";

const Card = ({ header, body }) => (
  <div style={{
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: 3,
  }}>
    <div>
      {header}
    </div>
    <div>
      {body}
    </div>
  </div>
);

Card.propTypes = {
  header: PropTypes.element.isRequired,
  body: PropTypes.element.isRequired,
};

export default Card;
