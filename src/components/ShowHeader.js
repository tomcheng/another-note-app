import React, { PropTypes } from "react";
import { Link } from "react-router";

const ShowHeader = ({ note }) => (
  <div style={{ display: "flex" }}>
    <Link
      to={"/" + note.id + "/edit?focus=title"}
      style={{
        flexGrow: 1,
        display: "block",
        padding: "12px 15px 5px",
        fontSize: 24,
        lineHeight: "30px",
      }}
    >
      {note.title}
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
