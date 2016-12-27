import React, { Component, PropTypes } from 'react';
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Search from "./Search";
import Notes from "./Notes";
import Preview from "./Preview";
import SectionDivider from "./SectionDivider";

const DRAG_HANDLE_HEIGHT = 10;

class App extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    listHeight: PropTypes.number.isRequired,
    onSetListHeight: PropTypes.func.isRequired,
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
    window.addEventListener("resize", () => {
      this.setState({ appHeight: window.innerHeight });
    })
  };

  handleDrag = (e, ui) => {
    this.props.onSetListHeight({ height: ui.y });
  };

  render () {
    const { listHeight, isEditing, selectedNote } = this.props;
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
          {!isEditing && (
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
            {selectedNote ? (
              <Preview selectedNote={selectedNote} />
            ) : (
              <div style={{
                lineHeight: "42px",
                color: "#fff",
                opacity: 0.3,
                textAlign: "center",
              }}>
                Nothing selected
              </div>
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
});

export default connect(mapStateToProps, {
  onSetListHeight: actions.setListHeight,
})(App);
