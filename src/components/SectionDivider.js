import React, { PropTypes } from "react";
import Draggable from "react-draggable";
import "./SectionDivider.css";

const SectionDivider = ({ listHeight, onDrag, height }) => (
  <Draggable
    axis="y"
    onDrag={onDrag}
    defaultPosition={{ x: 0, y: listHeight }}
  >
    <div style={{
      height: 40,
      top: -14,
      left: 0,
      right: 0,
      position: "absolute",
      zIndex: 1,
    }}>
      <div
        className="SectionDividerHandle"
        style={{
          marginTop: 14,
          height,
          lineHeight: height + "px",
        }}
      >
        <i className="fa fa-ellipsis-h SectionDividerHandleIcon" />
      </div>
    </div>
  </Draggable>
);

SectionDivider.propTypes = {
  height: PropTypes.number.isRequired,
  listHeight: PropTypes.number.isRequired,
  onDrag: PropTypes.func.isRequired,
};

export default SectionDivider;
