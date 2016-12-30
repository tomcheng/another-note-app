import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { selectors } from "../reducer";
import { Link } from "react-router";
import Icon from "./Icon";
import SingleNote from "./SingleNote";
import SingleList from "./SingleList";

class Single extends Component {
  static propTypes = {
    notes: PropTypes.object.isRequired,
    notesLoaded: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  render () {
    const { params, notes, notesLoaded } = this.props;

    if (!notesLoaded) { return <noscript />; }

    const selectedNote = notes[params.id];

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}>
        <Link to="/">
          <div style={{ flexShrink: 0, color: "#fff" }}>
            <Icon
              icon="long-arrow-left"
              action
            />
          </div>
        </Link>
        <div style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}>
          {selectedNote.type === "list" && (
            <SingleList list={selectedNote} />
          )}
          {selectedNote.type === "note" && (
            <SingleNote note={selectedNote} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state),
  notesLoaded: selectors.getNotesLoaded(state),
});

export default connect(mapStateToProps)(Single);
