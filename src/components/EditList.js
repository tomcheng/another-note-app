import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { withRouter } from "react-router";
import TextInput from "./TextInput";
import Button from "./Button";
import Card from "./Card";
import EditListItem from "./EditListItem";
import Checkbox from "./Checkbox";
import PreviewFooter from "./PreviewFooter";

const LIST_HEIGHT = 36;

class EditList extends Component {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        focus: PropTypes.string,
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
      default:
        break;
    }
  }

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
    const { list, onUpdateNote, onAddListItem } = this.props;
    const { title, addItemValue } = this.state;

    if (addItemValue.trim() !== "") {
      onAddListItem({ listId: list.id, value: addItemValue });
    }

    onUpdateNote({
      id: list.id,
      updates: { title },
      callback: this.redirect,
    });
  };

  redirect = () => {
    this.props.router.goBack();
  };

  render () {
    const { list, onUpdateListItem, onDeleteListItem } = this.props;
    const { title, addItemValue } = this.state;

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
          padding: "6px 5px",
        }}>
          <Card
            header={(
              <TextInput
                name="body"
                value={title}
                placeholder="Add a title"
                refCallback={el => { this.titleField = el; }}
                onChange={this.handleChangeTitle}
                onEnter={this.handleEnterTitle}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "3px 3px 0 0",
                  fontWeight: 500,
                }}
                singleLine
              />
            )}
            body={(
              <div style={{ padding: "8px 12px 10px" }}>
                {list.uncheckedItems.map(item => (
                  <EditListItem
                    key={item.id}
                    height={LIST_HEIGHT}
                    item={item}
                    listId={list.id}
                    onDeleteListItem={onDeleteListItem}
                    onUpdateListItem={onUpdateListItem}
                  />
                ))}
                <div style={{ height: LIST_HEIGHT, display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={false}
                    label={(
                      <TextInput
                        refCallback={el => { this.addItemField = el; }}
                        value={addItemValue}
                        placeholder="+ Add item"
                        style={{ flexGrow: 1, marginLeft: -5, paddingTop: 7, paddingBottom: 7 }}
                        onChange={this.handleChangeAddItem}
                        onEnter={this.handleEnterAddItem}
                        singleLine
                      />
                    )}
                    disabled
                    alignWithTextInput
                  />
                </div>
              </div>
            )}
          />
        </div>
        <div style={{ flexShrink: 0 }}>
          <PreviewFooter>
            <Button
              buttonStyle="link"
              style={{
                marginRight: 10,
                opacity: 0.8,
              }}
              onClick={this.redirect}
            >
              Cancel
            </Button>
            <Button
              buttonStyle="ghost"
              style={{ marginRight: 10 }}
              disabled={addItemValue.trim() === ""}
              onClick={this.handleClickAddAnother}
            >
              Add Another
            </Button>
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
  onUpdateListItem: actions.requestUpdateListItem,
  onUpdateNote: actions.requestUpdateNote,
})(EditList));
