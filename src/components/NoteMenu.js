import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { actions } from "../reducer";
import capitalize from "lodash/capitalize";
import Icon from "./Icon";
import Button from "./Button";
import PopoverItem from "./PopoverItem";

class NoteMenu extends Component {
  static propTypes = {
    selectedNote: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf(["list", "note"]).isRequired,
      hideChecked: PropTypes.bool,
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    onConvertNoteToList: PropTypes.func.isRequired,
    onDeleteNote: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  state = {
    menuOpen: false,
    deleteModalShowing: false,
  };

  handleClickIcon = () => {
    this.setState({ menuOpen: true });
  };

  handleClickOverlay = () => {
    this.setState({ menuOpen: false });
  };

  handleClickDelete = () => {
    this.setState({
      menuOpen: false,
      deleteModalShowing: true,
    });
  };

  handleCloseDeleteModal = () => {
    this.setState({ deleteModalShowing: false });
  };

  handleDeleteNote = () => {
    const { onDeleteNote, selectedNote, router } = this.props;

    this.setState({ deleteModalShowing: false });

    onDeleteNote({
      id: selectedNote.id,
      callback: () => { router.push("/"); },
    });
  };

  handleClickConvertToList = () => {
    const { onConvertNoteToList, selectedNote } = this.props;

    this.setState({ menuOpen: false });

    onConvertNoteToList({ id: selectedNote.id });
  };

  render () {
    const { selectedNote } = this.props;
    const { menuOpen, deleteModalShowing } = this.state;

    return (
      <div style={{ position: "relative" }}>
        <Icon
          icon="ellipsis-v"
          action
          onClick={this.handleClickIcon}
        />
        {menuOpen && (
          <div>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onClick={this.handleClickOverlay}
            />
            <div style={{
              position: "absolute",
              top: 2,
              right: 7,
              backgroundColor: "#fff",
              boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
              zIndex: 1,
            }}>
              {selectedNote.type !== "list" && (
                <PopoverItem onClick={this.handleClickConvertToList}>
                  Convert to List
                </PopoverItem>
              )}
              <PopoverItem onClick={this.handleClickDelete}>
                Delete
              </PopoverItem>
            </div>
          </div>
        )}
        {deleteModalShowing && (
          <div>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1,
              }}
              onClick={this.handleCloseDeleteModal}
            />
            <div style={{
              backgroundColor: "#fff",
              position: "fixed",
              top: 100,
              left: "50%",
              marginLeft: -150,
              width: 300,
              boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
              borderRadius: 2,
              padding: "15px 20px 20px",
              zIndex: 1,
            }}>
              <h3 style={{ marginBottom: 12 }}>
                Are you sure?
              </h3>
              <div style={{ marginBottom: 20 }}>
                Deleting this {selectedNote.type} cannot be undone.
              </div>
              <div style={{ textAlign: "right" }}>
                <Button buttonStyle="link" onClick={this.handleCloseDeleteModal}>
                  cancel
                </Button>
                <Button buttonStyle="danger" onClick={this.handleDeleteNote}>
                  Delete {capitalize(selectedNote.type)}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(connect(null, {
  onConvertNoteToList: actions.requestConvertNoteToList,
  onDeleteNote: actions.requestDeleteNote,
  onUpdateNote: actions.requestUpdateNote,
})(NoteMenu));
