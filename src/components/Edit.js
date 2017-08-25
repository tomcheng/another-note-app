import PropTypes from "prop-types";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import queryString from "query-string";
import { selectors, actions } from "../reducer";
import EditNote from "./EditNote";
import EditList from "./EditList";

class Edit extends Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired
    }).isRequired,
    notes: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    onUpdateNote: PropTypes.func.isRequired
  };

  handleUpdateNote = ({ id, updates }) => {
    const { onUpdateNote, history } = this.props;
    const query = queryString.parse(this.props.location.search);

    onUpdateNote({
      id,
      updates,
      callback: () => {
        if (query.just_added === "true") {
          history.replace("/" + id);
        } else {
          history.goBack();
        }
      }
    });
  };

  render() {
    const { match, location, notes } = this.props;
    const selectedNote = notes[match.params.id];

    if (!selectedNote) {
      return <Redirect to="/" />;
    }

    return selectedNote.type === "note"
      ? <EditNote
          location={location}
          onUpdateNote={this.handleUpdateNote}
          note={selectedNote}
        />
      : <EditList
          location={location}
          onUpdateNote={this.handleUpdateNote}
          list={selectedNote}
        />;
  }
}

const mapStateToProps = state => ({
  notes: selectors.getNotesById(state)
});

export default connect(mapStateToProps, {
  onUpdateNote: actions.requestUpdateNote
})(Edit);
