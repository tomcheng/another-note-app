import React, { PropTypes } from "react";
import FancyIcon from "./FancyIcon";

const IconWithText = ({ icon, text }) => (
  <div style={{ textAlign: "center", width: 48 }}>
    <div style={{ margin: "9px auto 0", width: 24 }}>
      <FancyIcon icon={icon} />
    </div>
    <div style={{
      opacity: 0.8,
      fontSize: 10,
      lineHeight: "12px",
      marginTop: 4,
      paddingBottom: 9,
    }}>
      {text}
    </div>
  </div>
);

IconWithText.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default IconWithText;
