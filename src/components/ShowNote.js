import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import Card from "./Card";
import NoteMenu from "./NoteMenu";

class ShowNote extends Component {
  static propTypes = {
    note: PropTypes.shape({
      body: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  };

  render () {
    const { note } = this.props;

    return (
      <Card
        header={(
          <div style={{ display: "flex" }}>
            <Link
              to={"/" + note.id + "/edit?focus=title"}
              style={{
                flexGrow: 1,
                display: "block",
                padding: "10px 12px",
                fontWeight: 500,
              }}
            >
              {note.title}
            </Link>
            <NoteMenu selectedNote={note} />
          </div>
        )}
        body={(
          <Link to={"/" + note.id + "/edit?focus=body"}>
            <pre style={{
              padding: "10px 12px 12px",
              minHeight: 66,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}>
              {note.body}
            </pre>
          </Link>
        )}
      />
    );
  }
}

export default ShowNote;
