import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import { withRouter } from "react-router";
import FancyIcon from "./FancyIcon";
import ShowNote from "./ShowNote";
import ShowList from "./ShowList";

class Show extends Component {
  static propTypes = {
    notes: PropTypes.object.isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    router: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  render () {
    const { params, router, notes, notesLoaded } = this.props;

    if (!notesLoaded || !params.id || !notes[params.id]) { return <noscript />; }

    const selectedNote = notes[params.id];

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}>
        <div
          className="showClose"
          style={{
            flexShrink: 0,
            color: "#fff",
            textAlign: "right",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 5px 2px",
          }}
        >
          <div
            onClick={router.goBack}
            style={{ padding: "9px 9px", cursor: "pointer" }}
          >
            <FancyIcon icon="left-arrow" />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ padding: "9px 9px", cursor: "pointer" }}>
              <FancyIcon icon="pencil" />
            </div>
            <div style={{ padding: "9px 9px", cursor: "pointer" }}>
              <FancyIcon icon="trash" />
            </div>
          </div>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexShrink: 1,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "0 5px 6px",
            display: "flex",
            flexDirection: "column",
          }}>
            {selectedNote.type === "list" && (
              <ShowList list={selectedNote} />
            )}
            {selectedNote.type === "note" && (
              <ShowNote note={selectedNote} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state),
  notesLoaded: selectors.getNotesLoaded(state),
});

export default withRouter(connect(mapStateToProps)(Show));
