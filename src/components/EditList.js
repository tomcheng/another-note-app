import React, { Component } from "react";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import queryString from "query-string";
import { actions, selectors } from "../reducer";
import { animate } from "../utils/animation";
import { withRouter } from "react-router-dom";
import BodyWrapper from "./BodyWrapper";
import TextInput from "./TextInput";
import Button from "./Button";
import Card from "./Card";
import EditListItem from "./EditListItem";
import Checkbox from "./Checkbox";
import PreviewFooter from "./PreviewFooter";

class EditList extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    }).isRequired,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      uncheckedItems: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          value: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired,
    rawList: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    onAddListItem: PropTypes.func.isRequired,
    onDeleteListItem: PropTypes.func.isRequired,
    onDeleteNote: PropTypes.func.isRequired,
    onReplaceList: PropTypes.func.isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { list, rawList } = props;

    this.state = {
      title: list.title,
      addItemValue: "",
      isAddingItem: false,
      previousRawList: rawList
    };
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search);

    switch (query.focus) {
      case "title":
        this.titleField.focus();
        break;
      case "addItem":
        this.addItemField.focus();
        break;
      case "item":
        this["item-" + query.item_id].focus();
        break;
      default:
        break;
    }

    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("keydown", this.handleKeyDown);

    if (this.animation) {
      this.animation.stop();
    }
  }

  handleWindowResize = () => {
    this.animateToTextField(document.activeElement);
  };

  handleKeyDown = evt => {
    if (evt.code === "Escape") {
      this.handleClickDone();
    }
  };

  animateToTextField = input => {
    this.animation = animate({
      start: 0,
      end:
        input.offsetTop + input.offsetHeight + 5 - this.container.offsetHeight,
      duration: 300,
      onUpdate: val => {
        this.container.scrollTop = val;
      }
    });
  };

  handleChangeTitle = ({ target }) => {
    this.setState({ title: target.value });
  };

  handleChangeAddItem = ({ target }) => {
    this.setState({ addItemValue: target.value });
  };

  handleEnterTitle = () => {
    this.addItemField.focus();
  };

  handleFocusTitle = () => {
    this.setState({ isAddingItem: false });
  };

  handleFocusEditItem = () => {
    this.setState({ isAddingItem: false });
  };

  handleEnterAddItem = () => {
    const { onAddListItem, list } = this.props;
    const { addItemValue } = this.state;

    if (addItemValue.trim() === "") {
      this.handleClickDone();
      return;
    }

    onAddListItem({ listId: list.id, value: addItemValue });

    this.setState({ addItemValue: "" });
  };

  handleFocusAddItem = () => {
    this.setState({ isAddingItem: true });
  };

  handleClickAddAnother = () => {
    const { list, onAddListItem } = this.props;
    const { addItemValue } = this.state;

    onAddListItem({
      listId: list.id,
      value: addItemValue
    });

    this.setState({ addItemValue: "" });
    this.addItemField.focus();
  };

  handleClickCancel = () => {
    const { list, location, onDeleteNote, onReplaceList, history } = this.props;
    const { previousRawList } = this.state;
    const query = queryString.parse(location.search);

    if (query.just_added === "true") {
      onDeleteNote({
        id: list.id,
        callback: () => {
          history.goBack();
        }
      });
    } else {
      onReplaceList({ id: list.id, list: previousRawList });
      history.goBack();
    }
  };

  handleClickDone = () => {
    const { list, onUpdateNote, onAddListItem } = this.props;
    const { title, addItemValue } = this.state;

    if (addItemValue.trim() !== "") {
      onAddListItem({ listId: list.id, value: addItemValue });
    }

    this.setState({ addItemValue: "" });

    onUpdateNote({
      id: list.id,
      updates: { title }
    });
  };

  handleBlur = event => {
    if (!event.relatedTarget) {
      this.handleClickDone();
    }
  };

  render() {
    const { list, onUpdateListItem, onDeleteListItem } = this.props;
    const { title, addItemValue, isAddingItem } = this.state;

    return (
      <div
        style={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          ref={el => {
            this.container = el;
          }}
          style={{ flexGrow: 1, overflow: "auto" }}
        >
          <BodyWrapper>
            <Card
              header={
                <div style={{ padding: "7px 7px 0" }}>
                  <TextInput
                    value={title}
                    placeholder="Add a title"
                    refCallback={el => {
                      this.titleField = el;
                    }}
                    onChange={this.handleChangeTitle}
                    onEnter={this.handleEnterTitle}
                    onFocus={this.handleFocusTitle}
                    onBlur={this.handleBlur}
                    style={{
                      width: "100%",
                      padding: "5px 8px",
                      fontSize: 24,
                      lineHeight: "30px"
                    }}
                    singleLine
                  />
                </div>
              }
              body={
                <div style={{ padding: "7px 15px 12px" }}>
                  {list.uncheckedItems.map(item => (
                    <CSSTransition
                      key={item.id}
                      classNames="listItem"
                      timeout={600}
                    >
                      <EditListItem
                        item={item}
                        listId={list.id}
                        onDeleteListItem={onDeleteListItem}
                        onUpdateListItem={onUpdateListItem}
                        onFocus={this.handleFocusEditItem}
                        onBlur={this.handleBlur}
                        refCallback={el => {
                          this["item-" + item.id] = el;
                        }}
                      />
                    </CSSTransition>
                  ))}
                  <Checkbox
                    checked={false}
                    label={
                      <div
                        style={{
                          padding: "2px 0",
                          display: "flex",
                          flexGrow: 1
                        }}
                      >
                        <TextInput
                          refCallback={el => {
                            this.addItemField = el;
                          }}
                          value={addItemValue}
                          placeholder="Add item"
                          style={{ flexGrow: 1, marginLeft: -5 }}
                          onChange={this.handleChangeAddItem}
                          onEnter={this.handleEnterAddItem}
                          onFocus={this.handleFocusAddItem}
                          onBlur={this.handleBlur}
                          singleLine
                        />
                      </div>
                    }
                    disabled
                  />
                </div>
              }
            />
          </BodyWrapper>
        </div>
        <div style={{ flexShrink: 0 }}>
          <PreviewFooter>
            <Button
              buttonStyle="link"
              style={{
                marginRight: 10,
                opacity: 0.8
              }}
              onClick={this.handleClickCancel}
            >
              Cancel
            </Button>
            {isAddingItem && (
              <Button
                buttonStyle="ghost"
                style={{ marginRight: 10 }}
                onClick={this.handleClickAddAnother}
                disabled={addItemValue.trim() === ""}
              >
                Add Another
              </Button>
            )}
            <Button buttonStyle="ghost" onClick={this.handleClickDone}>
              Done
            </Button>
          </PreviewFooter>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { list }) => ({
  rawList: selectors.getRawNotesById(state)[list.id]
});

export default withRouter(
  connect(mapStateToProps, {
    onAddListItem: actions.requestAddListItem,
    onDeleteListItem: actions.requestDeleteListItem,
    onDeleteNote: actions.requestDeleteNote,
    onReplaceList: actions.requestReplaceList,
    onUpdateListItem: actions.requestUpdateListItem
  })(EditList)
);
