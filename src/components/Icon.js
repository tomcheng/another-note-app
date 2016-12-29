import React, { PropTypes } from "react";
import classNames from "classnames";

const Icon = ({ icon, style, action, onClick }) => (
  <span
    style={{
      padding: action ? "0 10px" : null,
      lineHeight: action ? "42px" : null,
    }}
    onClick={onClick}
  >
    <i
      className={classNames("fa fa-" + icon, {
        "fa-fw": action,
      })}
      style={style}
    />
  </span>
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  action: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default Icon;
