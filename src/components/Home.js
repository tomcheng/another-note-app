import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Search from "./Search";
import Notes from "./Notes";
import NotePreview from "./NotePreview";
import ListPreview from "./ListPreview";
import SectionDivider from "./SectionDivider";

const DRAG_HANDLE_HEIGHT = 10;

class Home extends Component {
  static propTypes = {
    listHeight: PropTypes.number.isRequired,
    UISettingsLoaded: PropTypes.bool.isRequired,
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
      selectedNote,
      UISettingsLoaded,
    } = this.props;

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}>
        <div style={{ flexShrink: 0 }}>
          <Search />
        </div>
        <div style={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          {UISettingsLoaded && selectedNote && (
            <SectionDivider
              height={DRAG_HANDLE_HEIGHT}
              listHeight={listHeight}
              onDrag={this.handleDrag}
            />
          )}
          <Notes />
          {selectedNote && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              marginTop: 16,
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
  listHeight: selectors.getListHeight(state),
  selectedNote: selectors.getSelectedNote(state),
  UISettingsLoaded: selectors.getUISettingsLoaded(state),
});

export default connect(mapStateToProps, {
  onUpdateUISettings: actions.requestUpdateUISettings
})(Home);
