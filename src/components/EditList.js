import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import CSSTransition from "react-addons-css-transition-group";
import { actions } from "../reducer";
import { withRouter } from "react-router";
import { animate } from "../utils/animation";
import TextInput from "./TextInput";
import Button from "./Button";
import Card from "./Card";
import EditListItem from "./EditListItem";
import Checkbox from "./Checkbox";
import PreviewFooter from "./PreviewFooter";

class EditList extends Component {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        focus: PropTypes.string,
        just_added: PropTypes.string,
        item_id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      uncheckedItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    router: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    onAddListItem: PropTypes.func.isRequired,
    onDeleteListItem: PropTypes.func.isRequired,
    onDeleteNote: PropTypes.func.isRequired,
    onUpdateListItem: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    const { list } = props;

    this.state = {
      title: list.title,
      addItemValue: "",
    };
  }

  componentDidMount () {
    switch (this.props.location.query.focus) {
      case "title":
        this.titleField.focus();
        break;
      case "addItem":
        this.addItemField.focus();
        break;
      case "item":
        this["item-" + this.props.location.query.item_id].focus();
        break;
      default:
        break;
    }

    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.animateToTextField(document.activeElement);
  };

  animateToTextField = input => {
    animate({
      start: 0,
      end: input.offsetTop + input.offsetHeight + 60 - this.container.offsetHeight,
      duration: 300,
      onUpdate: val => { this.container.scrollTop = val; }
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

  handleEnterAddItem = () => {
    const { onAddListItem, list } = this.props;
    const { addItemValue } = this.state;

    if (addItemValue.trim() === "") {
      this.addItemField.blur();
      return;
    }

    onAddListItem({ listId: list.id, value: addItemValue });

    this.setState({ addItemValue: "" });
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

  handleClickDone = () => {
    const { list, onUpdateNote, onAddListItem, router } = this.props;
    const { title, addItemValue } = this.state;

    if (addItemValue.trim() !== "") {
      onAddListItem({ listId: list.id, value: addItemValue });
    }

    onUpdateNote({
      id: list.id,
      updates: { title },
      callback: () => { router.goBack(); },
    });
  };

  handleClickCancel = () => {
    const { list, location, onDeleteNote, router } = this.props;

    if (location.query.just_added === "true") {
      onDeleteNote({
        id: list.id,
        callback: () => {
          router.goBack();
          router.goBack();
        },
      })
    } else {
      router.goBack();
    }
  };

  render () {
    const { list, onUpdateListItem, onDeleteListItem } = this.props;
    const { title, addItemValue } = this.state;

    return (
      <div ref={el => { this.container = el; }} style={{ height: "100%", overflow: "auto" }}>
        <div style={{ padding: "6px 6px 60px" }}>
          <Card
            header={(
              <div style={{ padding: "7px 7px 0" }}>
                <TextInput
                  value={title}
                  placeholder="Add a title"
                  refCallback={el => { this.titleField = el; }}
                  onChange={this.handleChangeTitle}
                  onEnter={this.handleEnterTitle}
                  style={{
                    width: "100%",
                    padding: "5px 8px",
                    fontSize: 24,
                    lineHeight: "30px",
                  }}
                  singleLine
                />
              </div>
            )}
            body={(
              <div style={{ padding: "7px 15px 12px" }}>
                <CSSTransition
                  transitionName="listItem"
                  transitionEnterTimeout={600}
                  transitionLeaveTimeout={600}
                >
                  {list.uncheckedItems.map(item => (
                    <EditListItem
                      key={item.id}
                      item={item}
                      listId={list.id}
                      onDeleteListItem={onDeleteListItem}
                      onUpdateListItem={onUpdateListItem}
                      refCallback={el => { this["item-" + item.id] = el; }}
                    />
                  ))}
                </CSSTransition>
                <Checkbox
                  checked={false}
                  label={(
                    <div style={{ padding: "2px 0", display: "flex", flexGrow: 1 }}>
                      <TextInput
                        refCallback={el => { this.addItemField = el; }}
                        value={addItemValue}
                        placeholder="+ Add item"
                        style={{ flexGrow: 1, marginLeft: -5 }}
                        onChange={this.handleChangeAddItem}
                        onEnter={this.handleEnterAddItem}
                        singleLine
                      />
                    </div>
                  )}
                  disabled
                />
              </div>
            )}
          />
        </div>
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0 }}>
          <PreviewFooter>
            <Button
              buttonStyle="link"
              style={{
                marginRight: 10,
                opacity: 0.8,
              }}
              onClick={this.handleClickCancel}
            >
              Cancel
            </Button>
            {addItemValue.trim() !== "" && (
              <Button
                buttonStyle="ghost"
                style={{ marginRight: 10 }}
                onClick={this.handleClickAddAnother}
              >
                Add Another
              </Button>
            )}
            <Button
              buttonStyle="ghost"
              onClick={this.handleClickDone}
            >
              Done
            </Button>
          </PreviewFooter>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, {
  onAddListItem: actions.requestAddListItem,
  onDeleteListItem: actions.requestDeleteListItem,
  onDeleteNote: actions.requestDeleteNote,
  onUpdateListItem: actions.requestUpdateListItem,
  onUpdateNote: actions.requestUpdateNote,
})(EditList));
