import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import TextInput from "./TextInput";
import NoteMenu from "./NoteMenu";

const PreviewHeader = ({
  title,
  isEditing,
  onEditNoteTitle,
  onBlurTitle,
  onChangeTitle,
  onEnter,
}) => (
  <div style={{ display: "flex", borderBottom: "1px solid #2e8486" }}>
    <TextInput
      name="title"
      value={title}
      style={{
        padding: "10px 12px",
        fontWeight: 600,
        flexGrow: 1,
        borderRadius: "3px 3px 0 0",
      }}
      onFocus={onEditNoteTitle}
      onBlur={onBlurTitle}
      onChange={onChangeTitle}
      onEnter={onEnter}
      singleLine
    />
    {!isEditing && (
      <NoteMenu />
    )}
  </div>
);

PreviewHeader.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onBlurTitle: PropTypes.func.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  onEditNoteTitle: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isEditing: selectors.getIsEditing(state),
});

export default connect(mapStateToProps, {
  onEditNoteTitle: actions.editNoteTitle,
})(PreviewHeader);
