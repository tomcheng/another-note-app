import React, { Component, PropTypes } from 'react';
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Search from "./Search";
import Notes from "./Notes";
import NotePreview from "./NotePreview";
import ListPreview from "./ListPreview";
import SectionDivider from "./SectionDivider";

const DRAG_HANDLE_HEIGHT = 10;

class App extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    listHeight: PropTypes.number.isRequired,
    UISettingsLoaded: PropTypes.bool.isRequired,
    onRequestNotes: PropTypes.func.isRequired,
    onRequestUISettings: PropTypes.func.isRequired,
    onUpdateUISettings: PropTypes.func.isRequired,
    selectedNote: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }),
  };

  constructor (props) {
    super(props);

    this.state = {
      appHeight: window.innerHeight,
    };
  }

  componentDidMount () {
    this.props.onRequestNotes();
    this.props.onRequestUISettings();

    window.addEventListener("resize", () => {
      this.setState({ appHeight: window.innerHeight });
    })
  };

  handleDrag = (e, ui) => {
    this.props.onUpdateUISettings({ listHeight: ui.y });
  };

  render () {
    const { listHeight, isEditing, selectedNote, UISettingsLoaded } = this.props;
    const { appHeight } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: appHeight,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <Search />
        </div>
        <div style={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          {(!isEditing && UISettingsLoaded && selectedNote) && (
            <SectionDivider
              height={DRAG_HANDLE_HEIGHT}
              listHeight={listHeight}
              onDrag={this.handleDrag}
            />
          )}
          <Notes containerStyle={{ flexShrink: 0 }} />
          <div style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            marginTop: isEditing ? null : 10,
          }}>
            {selectedNote && selectedNote.type === "list" && (
              <ListPreview selectedNote={selectedNote} />
            )}
            {selectedNote && selectedNote.type === "note" && (
              <NotePreview selectedNote={selectedNote} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  listHeight: selectors.getListHeight(state),
  isEditing: selectors.getIsEditing(state),
  selectedNote: selectors.getSelectedNote(state),
  UISettingsLoaded: selectors.getUISettingsLoaded(state),
});

export default connect(mapStateToProps, {
  onUpdateUISettings: actions.requestUpdateUISettings,
  onRequestNotes: actions.requestNotes,
  onRequestUISettings: actions.requestUISettings,
})(App);
