import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import { withRouter, Link } from "react-router";
import FancyIcon from "./FancyIcon";
import DeleteModal from "./DeleteModal";
import ShowNote from "./ShowNote";
import ShowList from "./ShowList";
import ShowMenu from "./ShowMenu";

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
    onConvertNoteToList: PropTypes.func.isRequired,
    onDeleteNote: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  state = {
    deleteModalOpen: false,
  };

  componentDidMount () {
    const { notesLoaded, router } = this.props;
    const selectedNote = this.getSelectedNote();

    if (notesLoaded && !selectedNote) {
      router.goBack();
    }
  }

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

  handleClickPin = () => {
    const { onUpdateNote } = this.props;
    const selectedNote = this.getSelectedNote();

    onUpdateNote({ id: selectedNote.id, updates: {
      pinned: !selectedNote.pinned,
    } });
  };

  getSelectedNote = (props = this.props) => {
    const {params, notes} = props;

    if (!params.id || !notes[params.id]) { return null; }

    return notes[params.id];
  };

  handleToggleHideChecked = () => {
    const { onUpdateNote } = this.props;
    const list = this.getSelectedNote();

    onUpdateNote({
      id: list.id,
      updates: { hideChecked: !list.hideChecked },
    });
  };

  handleConvertNoteToList = () => {
    const { onConvertNoteToList } = this.props;
    const note = this.getSelectedNote();

    onConvertNoteToList({ id: note.id });
  };

  render () {
    const { router } = this.props;
    const { deleteModalOpen } = this.state;
    const selectedNote = this.getSelectedNote();

    if (!selectedNote) { return <noscript />; }

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
          style={{
            flexShrink: 0,
            color: "#fff",
            textAlign: "right",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 7px 2px",
            backgroundColor: "rgba(0,0,0,0.5)",
            boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.2)",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
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
          </div>
        </div>
        <div style={{
          flexGrow: 1,
          flexShrink: 1,
          overflow: "auto",
        }}>
          <div style={{ padding: 6 }}>
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
  onConvertNoteToList: actions.requestConvertNoteToList,
  onDeleteNote: actions.requestDeleteNote,
  onUpdateNote: actions.requestUpdateNote,
})(Show));
