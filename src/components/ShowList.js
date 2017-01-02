import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { Link } from "react-router";
import Card from "./Card";
import NoteMenu from "./NoteMenu";
import ShowListItem from "./ShowListItem";
import Checkbox from "./Checkbox";

const LIST_HEIGHT = 36;

class ShowList extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
  };

  render () {
    const { list, onUpdateListItem } = this.props;

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
          <div style={{ padding: "8px 12px 10px" }}>
            {list.items.map(item => (
              <ShowListItem
                height={LIST_HEIGHT}
                key={item.id}
                isVisible={!list.hideChecked || !item.checked}
                item={item}
                listId={list.id}
                onUpdateListItem={onUpdateListItem}
              />
            ))}
            <Link to={"/" + list.id + "/edit?focus=addItem"}>
              <div style={{ height: LIST_HEIGHT, display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={false}
                  label={(
                    <div style={{ opacity: 0.4 }}>
                      + Add item
                    </div>
                  )}
                  disabled
                />
              </div>
            </Link>
          </div>
        )}
      />
    );
  }
}

export default connect(null, {
  onUpdateListItem: actions.requestUpdateListItem,
})(ShowList);
