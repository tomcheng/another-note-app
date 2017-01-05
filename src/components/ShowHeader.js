import React, { PropTypes } from "react";
import { Link } from "react-router";

const ShowHeader = ({ note }) => (
  <div style={{ padding: "7px 7px 0" }}>
    <Link
      to={"/" + note.id + "/edit?focus=title"}
      style={{
        display: "block",
        padding: "5px 8px",
        fontSize: 24,
        lineHeight: "30px",
      }}
    >
      {note.title.trim() === "" ? (
        <span style={{ opacity: 0.4 }}>Add Title</span>
      ) : note.title}
    </Link>
  </div>
);


ShowHeader.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowHeader;
