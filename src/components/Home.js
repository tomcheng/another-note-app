import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Icon from "./Icon";
import Search from "./Search";
import Notes from "./Notes";
import NotePreview from "./NotePreview";
import ListPreview from "./ListPreview";
import SectionDivider from "./SectionDivider";

const DRAG_HANDLE_HEIGHT = 10;

class Home extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isViewing: PropTypes.bool.isRequired,
    listHeight: PropTypes.number.isRequired,
    UISettingsLoaded: PropTypes.bool.isRequired,
    onToggleViewing: PropTypes.func.isRequired,
    onUpdateUISettings: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }),
  };

  handleDrag = (e, ui) => {
    this.props.onUpdateUISettings({ listHeight: ui.y });
  };

  render () {
    const {
      listHeight,
      isEditing,
      isViewing,
      selectedNote,
      UISettingsLoaded,
      onToggleViewing,
    } = this.props;

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}>
        {(!isEditing && !isViewing) && (
          <div style={{ flexShrink: 0 }}>
            <Search />
          </div>
        )}
        <div style={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          {(!isEditing && !isViewing && UISettingsLoaded && selectedNote) && (
            <SectionDivider
              height={DRAG_HANDLE_HEIGHT}
              listHeight={listHeight}
              onDrag={this.handleDrag}
            />
          )}
          {(!isEditing && !isViewing) && (
            <Notes />
          )}
          {(isEditing || isViewing) && (
            <div style={{ flexShrink: 0, color: "#fff" }}>
              <Icon
                icon="long-arrow-left"
                action
                onClick={onToggleViewing}
              />
            </div>
          )}
          {selectedNote && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              marginTop: isEditing || isViewing ? null : 16,
            }}>
              {selectedNote.type === "list" && (
                <ListPreview selectedNote={selectedNote} />
              )}
              {selectedNote.type === "note" && (
                <NotePreview selectedNote={selectedNote} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isEditing: selectors.getIsEditing(state),
  isViewing: selectors.getIsViewing(state),
  listHeight: selectors.getListHeight(state),
  selectedNote: selectors.getSelectedNote(state),
  UISettingsLoaded: selectors.getUISettingsLoaded(state),
});

export default connect(mapStateToProps, {
  onToggleViewing: actions.toggleViewing,
  onUpdateUISettings: actions.requestUpdateUISettings
})(Home);
