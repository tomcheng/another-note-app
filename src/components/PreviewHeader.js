import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import { Link } from "react-router";
import TextInput from "./TextInput";
import NoteMenu from "./NoteMenu";

const PreviewHeader = ({
  title,
  isEditing,
  selectedNote,
  onSetEditing,
  onChangeTitle,
  onEnter,
}) => (
  <div style={{ display: "flex" }}>
    {isEditing && (
      <TextInput
        name="title"
        value={title}
        style={{
          padding: "10px 12px",
          fontWeight: 600,
          flexGrow: 1,
          borderRadius: "3px 3px 0 0",
        }}
        onFocus={onSetEditing}
        onChange={onChangeTitle}
        onEnter={onEnter}
        singleLine
      />
    )}
    {!isEditing && (
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
    )}
    {!isEditing && (
      <NoteMenu />
    )}
  </div>
);

PreviewHeader.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  selectedNote: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onSetEditing: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isEditing: selectors.getIsEditing(state),
  selectedNote: selectors.getSelectedNote(state),
});

export default connect(mapStateToProps, {
  onSetEditing: actions.setEditing,
})(PreviewHeader);
