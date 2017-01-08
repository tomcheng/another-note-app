import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import withRouter from "../utils/withRouter";
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
      transitionTo: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentDidMount () {
    const { notesLoaded, router } = this.props;
    const selectedNote = this.getSelectedNote();

    if (notesLoaded && !selectedNote) {
      router.goBack();
    }
  }

  getSelectedNote = (props = this.props) => {
    const { notes, params } = props;

    if (!params.id || !notes[params.id]) { return null; }

    return notes[params.id];
  };

  render () {
    const selectedNote = this.getSelectedNote();

    if (!selectedNote) { return <noscript />; }

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100%",
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
