import React, { PropTypes } from "react";
import Draggable from "react-draggable";
import "./SectionDivider.css";

const SectionDivider = ({ listHeight, isEditing, onDrag }) => (
  <Draggable
    axis="y"
    onDrag={onDrag}
    defaultPosition={{ x: 0, y: listHeight }}
  >
    <div
      style={{
        display: isEditing ? "none" : null,
        height: 40,
        top: -13,
        left: 0,
        right: 0,
        position: "absolute",
        zIndex: 1,
      }}
    >
      <div className="SectionDividerHandle" style={{
        marginTop: 13,
      }}>
        <i className="fa fa-ellipsis-h SectionDividerHandleIcon" />
      </div>
    </div>
  </Draggable>
);

SectionDivider.propTypes = {};

export default SectionDivider;
