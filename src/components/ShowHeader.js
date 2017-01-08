import React, { PropTypes, Component } from "react";
import withRouter from "../utils/withRouter";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Link from "react-router/Link";
import FancyIcon from "./FancyIcon";
import DeleteModal from "./DeleteModal";
import ShowMenu from "./ShowMenu";

class ShowHeader extends Component {
  static propTypes = {
    notes: PropTypes.object.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    router: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    onConvertNoteToList: PropTypes.func.isRequired,
    onDeleteNote: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  state = {
    deleteModalOpen: false,
  };

  handleClickPin = () => {
    const { onUpdateNote } = this.props;
    const selectedNote = this.getSelectedNote();

    onUpdateNote({ id: selectedNote.id, updates: {
      pinned: !selectedNote.pinned,
    } });
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
      callback: () => { router.transitionTo("/"); },
    });
  };

  handleConvertNoteToList = () => {
    const { onConvertNoteToList } = this.props;
    const note = this.getSelectedNote();

    onConvertNoteToList({ id: note.id });
  };

  handleToggleHideChecked = () => {
    const { onUpdateNote } = this.props;
    const list = this.getSelectedNote();

    onUpdateNote({
      id: list.id,
      updates: { hideChecked: !list.hideChecked },
    });
  };

  getSelectedNote = (props = this.props) => {
    const { params, notes } = props;

    if (!params.id || !notes[params.id]) { return null; }

    return notes[params.id];
  };

  render () {
    const { router } = this.props;
    const { deleteModalOpen } = this.state;
    const selectedNote = this.getSelectedNote();

    if (!selectedNote) { return <noscript />; }

    return (
      <div
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
          <div
            onClick={this.handleClickPin}
            style={{
              padding: 9,
              cursor: "pointer",
              opacity: selectedNote.pinned ? 1 : 0.4,
            }}
          >
            <FancyIcon
              icon="pin"
              color={selectedNote.pinned ? "#ffff72" : "#fff"}
            />
          </div>
          <Link
            to={"/" + selectedNote.id + "/edit?focus=title"}
            style={{ display: "block", padding: 9 }}
          >
            <FancyIcon icon="pencil" />
          </Link>
          <div
            onClick={this.handleClickDelete}
            style={{ padding: 9, cursor: "pointer" }}
          >
            <FancyIcon icon="trash" />
          </div>
          {selectedNote.type === "note" && (
            <ShowMenu
              menuItems={[
                {
                  label: "Convert to List",
                  action: this.handleConvertNoteToList,
                }
              ]}
            />
          )}
          {selectedNote.type === "list" && (
            <ShowMenu
              menuItems={[
                {
                  label: selectedNote.hideChecked ? "Show completed items" : "Hide completed items",
                  action: this.handleToggleHideChecked,
                }
              ]}
            />
          )}
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={this.handleCloseDeleteModal}
            onDelete={this.handleDeleteNote}
            noteType={selectedNote.type}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state),
});

export default withRouter(connect(mapStateToProps, {
  onConvertNoteToList: actions.requestConvertNoteToList,
  onDeleteNote: actions.requestDeleteNote,
  onUpdateNote: actions.requestUpdateNote,
})(ShowHeader));
