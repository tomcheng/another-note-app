import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import Card from "./Card";
import NoteMenu from "./NoteMenu";
import ListManager from "./ListManager";

class SingleList extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  };

  render () {
    const { list } = this.props;

    return (
      <Card
        header={(
          <div style={{ display: "flex" }}>
            <Link
              to={"/" + list.id + "/edit?focus=title"}
              style={{
                flexGrow: 1,
                display: "block",
                padding: "10px 12px",
                fontWeight: 500,
              }}
            >
              {list.title}
            </Link>
            <NoteMenu selectedNote={list} />
          </div>
        )}
        body={(
          <div style={{ padding: "10px 12px 12px", minHeight: 66 }}>
            <ListManager list={list} />
          </div>
        )}
      />
    );
  }
}

export default SingleList;
