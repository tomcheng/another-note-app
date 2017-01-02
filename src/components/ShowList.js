import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { SortableContainer, arrayMove } from "react-sortable-hoc";
import { Link } from "react-router";
import Card from "./Card";
import NoteMenu from "./NoteMenu";
import ShowListItem from "./ShowListItem";
import Checkbox from "./Checkbox";
import "./ShowList.css";

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
    onUpdateNote: PropTypes.func.isRequired,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { onUpdateNote, list } = this.props;

    onUpdateNote({
      id: list.id,
      updates: {
        items: arrayMove(list.items, oldIndex, newIndex),
      },
    })
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
            <ShowListItems
              items={list.items}
              list={list}
              onUpdateListItem={onUpdateListItem}
              onSortEnd={this.onSortEnd}
              pressDelay={200}
              transitionDuration={200}
              helperClass="listItemDragging"
            />
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

const ShowListItems = SortableContainer(({ items, list, onUpdateListItem }) => (
  <div>
    {items.map((item, index) => (
      <ShowListItem
        key={item.id}
        index={index}
        height={LIST_HEIGHT}
        isVisible={!list.hideChecked || !item.checked}
        item={item}
        listId={list.id}
        onUpdateListItem={onUpdateListItem}
      />
    ))}
  </div>
))

export default connect(null, {
  onUpdateListItem: actions.requestUpdateListItem,
  onUpdateNote: actions.requestUpdateNote,
})(ShowList);
