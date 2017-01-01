import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { Link } from "react-router";
import NoteMenu from "./NoteMenu";

const PreviewHeader = ({
  title,
  selectedNote,
  onChangeTitle,
  onEnter,
}) => (
  <div style={{ display: "flex" }}>
    <Link
      to={"/" + selectedNote.id}
      style={{
        padding: "10px 12px",
        fontWeight: 600,
        flexGrow: 1,
        display: "block",
      }}
    >
      {title}
    </Link>
    <NoteMenu selectedNote={selectedNote} />
  </div>
);

PreviewHeader.propTypes = {
  selectedNote: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
};

export default connect(null, {
  onSetEditing: actions.setEditing,
})(PreviewHeader);
