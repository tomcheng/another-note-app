import React, { PropTypes } from "react";
import classNames from "classnames";

const Icon = ({ icon, style, action, onClick, height }) => (
  <span
    style={{
      padding: action ? "0 10px" : null,
      lineHeight: action ? height + "px" : null,
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
  height: PropTypes.number,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  height: 42,
};

export default Icon;
