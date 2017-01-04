import React, { PropTypes } from "react";
import { Link } from "react-router";
import NoteMenu from "./NoteMenu";

const ShowHeader = ({ note }) => (
  <div style={{ display: "flex" }}>
    <Link
      to={"/" + note.id + "/edit?focus=title"}
      style={{
        flexGrow: 1,
        display: "block",
        padding: "10px 12px",
        fontWeight: 500,
      }}
    >
      {note.title}
    </Link>
    <div style={{ flexShrink: 0 }}>
      <NoteMenu selectedNote={note} />
    </div>
  </div>
);


ShowHeader.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowHeader;
