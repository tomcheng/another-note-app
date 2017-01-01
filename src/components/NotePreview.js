import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import Card from "./Card";

class NotePreview extends Component {
  static propTypes = {
    selectedNote: PropTypes.shape({
      body: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  };

  render () {
    const { selectedNote } = this.props;

    return (
      <div style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 5px 6px",
        }}>
          <Card
            header={(
              <Link
                to={"/" + selectedNote.id}
                style={{ display: "block", padding: "10px 12px", fontWeight: 600 }}
              >
                {selectedNote.title}
              </Link>
            )}
            body={(
              <Link to={"/" + selectedNote.id + "/edit?focus=body"}>
                <pre style={{ padding: "10px 12px 12px", minHeight: 66 }}>
                  {selectedNote.body}
                </pre>
              </Link>
            )}
          />
        </div>
      </div>
    );
  }
}

export default NotePreview;
