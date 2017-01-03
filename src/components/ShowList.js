import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";
import { Link } from "react-router";
import Card from "./Card";
import Button from "./Button";
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
      hideChecked: PropTypes.bool.isRequired,
      uncheckedItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
      checkedItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    onCheckListItem: PropTypes.func.isRequired,
    onUncheckListItem: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { onUpdateNote, list } = this.props;

    onUpdateNote({
      id: list.id,
      updates: {
        order: arrayMove(list.uncheckedItems.map(item => item.id), oldIndex, newIndex),
      },
    })
  };

  handleClickToggleShowChecked = () => {
    const { onUpdateNote, list } = this.props;

    onUpdateNote({
      id: list.id,
      updates: {
        hideChecked: !list.hideChecked,
      }
    });
  };

  render () {
    const { list, onCheckListItem, onUncheckListItem } = this.props;

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
            <div style={{ flexShrink: 0 }}>
              <NoteMenu selectedNote={list} />
            </div>
          </div>
        )}
        body={(
          <div style={{ padding: "8px 12px 10px" }}>
            <ShowListItems
              list={list}
              onCheckListItem={onCheckListItem}
              onUncheckListItem={onUncheckListItem}
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
            {list.checkedItems.length > 0 && (
              <div style={{
                textAlign: "center",
                paddingTop: 10,
                paddingBottom: 10,
              }}>
                <Button
                  buttonStyle="outline"
                  onClick={this.handleClickToggleShowChecked}
                >
                  {list.hideChecked ? "Show completed items" : "Hide completed items"}
                </Button>
              </div>
            )}
            {!list.hideChecked && list.checkedItems.map(item => (
              <ShowListItem
                key={item.id}
                height={LIST_HEIGHT}
                isVisible={item.checked}
                item={item}
                listId={list.id}
                onCheckListItem={onCheckListItem}
                onUncheckListItem={onUncheckListItem}
              />
            ))}
          </div>
        )}
      />
    );
  }
}

const ShowListItems = SortableContainer(({ list, ...other }) => (
  <div>
    {list.uncheckedItems.map((item, index) => (
      <SortableListItem
        {...other}
        key={item.id}
        item={item}
        listId={list.id}
        index={index}
        height={LIST_HEIGHT}
        isVisible={!item.checked}
      />
    ))}
  </div>
));

const SortableListItem = SortableElement(props => (
  <ShowListItem {...props} />
));

export default connect(null, {
  onCheckListItem: actions.requestCheckListItem,
  onUncheckListItem: actions.requestUncheckListItem,
  onUpdateNote: actions.requestUpdateNote,
})(ShowList);
