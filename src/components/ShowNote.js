import React, { PropTypes, Component } from "react";
import Link from "./Link";
import Card from "./Card";
import CardHeader from "./CardHeader";

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
        header={<CardHeader note={note} />}
        body={(
          <Link to={"/" + note.id + "/edit?focus=body"}>
            <pre style={{
              padding: "7px 15px 12px",
              minHeight: 66,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              opacity: note.body.trim() === "" ? 0.4 : null,
            }}>
              {note.body.trim() === "" ? "Add Description" : note.body}
            </pre>
          </Link>
        )}
      />
    );
  }
}

export default ShowNote;
