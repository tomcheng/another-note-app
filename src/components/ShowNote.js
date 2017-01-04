import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import Card from "./Card";
import ShowHeader from "./ShowHeader";

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
        header={<ShowHeader note={note} />}
        body={(
          <Link to={"/" + note.id + "/edit?focus=body"}>
            <pre style={{
              padding: "7px 15px 12px",
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
