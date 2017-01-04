import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import { withRouter, Link } from "react-router";
import FancyIcon from "./FancyIcon";
import DeleteModal from "./DeleteModal";
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
      push: PropTypes.func.isRequired,
    }).isRequired,
    onDeleteNote: PropTypes.func.isRequired,
  };

  state = {
    deleteModalOpen: false,
  };

  handleClickDelete = () => {
    this.setState({ deleteModalOpen: true });
  };

  handleCloseDeleteModal = () => {
    this.setState({ deleteModalOpen: false });
  };

  handleDeleteNote = () => {
    const { onDeleteNote, params, router } = this.props;

    this.setState({ deleteModalOpen: false });

    onDeleteNote({
      id: parseInt(params.id, 10),
      callback: () => { router.push("/"); },
    });
  };

  render () {
    const { params, router, notes, notesLoaded } = this.props;
    const { deleteModalOpen } = this.state;

    if (!notesLoaded || !params.id || !notes[params.id]) { return <noscript />; }

    const selectedNote = notes[params.id];

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}>
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={this.handleCloseDeleteModal}
          onDelete={this.handleDeleteNote}
          noteType={selectedNote.type}
        />
        <div
          className="showClose"
          style={{
            flexShrink: 0,
            color: "#fff",
            textAlign: "right",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 7px 2px",
          }}
        >
          <div
            onClick={router.goBack}
            style={{ padding: "9px 9px", cursor: "pointer" }}
          >
            <FancyIcon icon="left-arrow" />
          </div>
          <div style={{ display: "flex" }}>
            <Link
              to={"/" + selectedNote.id + "/edit?focus=title"}
              style={{ display: "block", padding: "9px 9px" }}
            >
              <FancyIcon icon="pencil" />
            </Link>
            <div
              onClick={this.handleClickDelete}
              style={{ padding: "9px 9px", cursor: "pointer" }}
            >
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
            padding: "0 10px 12px",
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

export default withRouter(connect(mapStateToProps, {
  onDeleteNote: actions.requestDeleteNote,
})(Show));
