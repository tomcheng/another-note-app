import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";
import Link from "./Link";
import Card from "./Card";
import Button from "./Button";
import CardHeader from "./CardHeader";
import ShowListItem from "./ShowListItem";
import Checkbox from "./Checkbox";
import AnimateHeight from "./AnimateHeight";
import PreviewFooter from "./PreviewFooter";
import "./ShowList.css";

class ShowList extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      hideChecked: PropTypes.bool.isRequired,
      uncheckedItems: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          value: PropTypes.string.isRequired
        })
      ).isRequired,
      checkedItems: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          value: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired,
    onCheckListItem: PropTypes.func.isRequired,
    onUncheckListItem: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired
  };

  state = {
    recentlyCheckedItemIds: [],
    previousOrder: []
  };

  componentWillUnmount = () => {
    clearTimeout(this.footerTimer);
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { onUpdateNote, list } = this.props;

    onUpdateNote({
      id: list.id,
      updates: {
        order: arrayMove(
          list.uncheckedItems.map(item => item.id),
          oldIndex,
          newIndex
        )
      }
    });
  };

  handleCheckListItem = ({ listId, itemId }) => {
    const { onCheckListItem, list } = this.props;
    const { recentlyCheckedItemIds } = this.state;

    onCheckListItem({ listId, itemId });

    this.setState({
      recentlyCheckedItemIds: recentlyCheckedItemIds.concat(itemId)
    });

    if (recentlyCheckedItemIds.length === 0) {
      this.setState({
        previousOrder: list.uncheckedItems.map(item => item.id)
      });
    }

    clearTimeout(this.footerTimer);

    this.footerTimer = setTimeout(() => {
      this.setState({
        recentlyCheckedItemIds: [],
        previousOrder: []
      });
    }, 3000);
  };

  handleClickUndo = () => {
    const { onUncheckListItem, onUpdateNote, list } = this.props;
    const { recentlyCheckedItemIds, previousOrder } = this.state;

    recentlyCheckedItemIds.forEach(id => {
      onUncheckListItem({ listId: list.id, itemId: id });
    });

    onUpdateNote({ id: list.id, updates: { order: previousOrder } });

    this.setState({
      recentlyCheckedItemIds: [],
      previousOrder: []
    });
  };

  render() {
    const { list, onUncheckListItem } = this.props;
    const { recentlyCheckedItemIds } = this.state;
    const isShowingChecked = list.checkedItems.length > 0 && !list.hideChecked;

    return (
      <Card
        header={<CardHeader note={list} />}
        body={
          <div style={{ padding: "7px 15px 12px" }}>
            <ShowListItems
              list={list}
              onCheckListItem={this.handleCheckListItem}
              onSortEnd={this.onSortEnd}
              pressDelay={200}
              transitionDuration={200}
              helperClass="listItemDragging"
            />
            <Link to={"/" + list.id + "/edit?focus=addItem"}>
              <Checkbox
                checked={false}
                label={
                  <div
                    style={{
                      color: "#45a1fe",
                      padding: "7px 0",
                      userSelect: "none"
                    }}
                  >
                    Add item
                  </div>
                }
                disabled
              />
            </Link>
            <AnimateHeight isExpanded={isShowingChecked}>
              <div>
                <div
                  style={{
                    height: 1,
                    backgroundColor: "#ddd",
                    margin: "9px 0"
                  }}
                />
                {list.checkedItems.map(item =>
                  <ShowListItem
                    key={item.id}
                    item={item}
                    listId={list.id}
                    onUncheckListItem={onUncheckListItem}
                  />
                )}
              </div>
            </AnimateHeight>
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0
              }}
            >
              <AnimateHeight isExpanded={recentlyCheckedItemIds.length > 0}>
                <PreviewFooter>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingLeft: 9
                    }}
                  >
                    {recentlyCheckedItemIds.length
                      ? <span>
                          Checked off {recentlyCheckedItemIds.length} item{recentlyCheckedItemIds.length === 1 ? "" : "s"}
                        </span>
                      : <span />}
                    <Button onClick={this.handleClickUndo} buttonStyle="ghost">
                      Undo
                    </Button>
                  </div>
                </PreviewFooter>
              </AnimateHeight>
            </div>
          </div>
        }
      />
    );
  }
}

const ShowListItems = SortableContainer(({ list, ...other }) =>
  <div>
    {list.uncheckedItems.map((item, index) =>
      <SortableListItem
        {...other}
        key={item.id}
        item={item}
        listId={list.id}
        index={index}
      />
    )}
  </div>
);

const SortableListItem = SortableElement(props => <ShowListItem {...props} />);

export default connect(null, {
  onCheckListItem: actions.requestCheckListItem,
  onUncheckListItem: actions.requestUncheckListItem,
  onUpdateNote: actions.requestUpdateNote
})(ShowList);
