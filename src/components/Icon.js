import React, { PropTypes } from "react";
import classNames from "classnames";

const Icon = ({ icon, style, action, onClick }) => (
  <i
    className={classNames("fa fa-" + icon, {
      "fa-fw": action,
    })}
    style={{
      padding: action ? "0 25px" : null,
      lineHeight: action ? "36px" : null,
      ...style,
    }}
    onClick={onClick}
  />
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  action: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default Icon;
