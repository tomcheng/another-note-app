import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Button from "./Button";
import PreviewHeader from "./PreviewHeader";
import PreviewFooter from "./PreviewFooter";
import ListManager from "./ListManager";
import Card from "./Card";

class ListPreview extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    selectedNote: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    onAddListItem: PropTypes.func.isRequired,
    onCancelEditing: PropTypes.func.isRequired,
    onSetAddListItem: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      title: this.props.selectedNote.title,
      addItemValue: "",
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.selectedNote !== nextProps.selectedNote) {
      this.setState({
        title: nextProps.selectedNote.title,
      });
    }
  }

  handleChangeTitle = ({ target }) => {
    this.setState({ title: target.value });
  };

  handleEnterTitle = () => {
    this.props.onSetAddListItem();
  };

  handleChangeAddItem = ({ target }) => {
    this.setState({ addItemValue: target.value });
  };

  handleClearAddItem = () => {
    this.setState({ addItemValue: "" })
  };

  handleClickAddAnother = () => {
    const { onAddListItem, onSetAddListItem, selectedNote } = this.props;
    const { addItemValue } = this.state;

    if (addItemValue.trim() === "") { return; }

    onAddListItem({ listId: selectedNote.id, value: addItemValue });
    onSetAddListItem();
    this.setState({ addItemValue: "" });
  };

  handleClickDone = () => {
    const { onAddListItem, onUpdateNote, selectedNote, onCancelEditing } = this.props;
    const { addItemValue } = this.state;

    if (addItemValue.trim() !== "") {
      onAddListItem({ listId: selectedNote.id, value: addItemValue });
      this.setState({ addItemValue: "" });
    }

    onUpdateNote({ id: selectedNote.id, updates: { title: this.state.title } });
    onCancelEditing();
  };

  render () {
    const { isEditing, selectedNote } = this.props;
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
          padding: "0 5px 6px",
        }}>
          <Card
            header={(
              <PreviewHeader
                title={title}
                onChangeTitle={this.handleChangeTitle}
                onEnter={this.handleEnterTitle}
                selectedNote={selectedNote}
              />
            )}
            body={(
              <div style={{ padding: "7px 12px 10px" }}>
                <ListManager
                  list={selectedNote}
                  addItemValue={addItemValue}
                  onChangeAddItem={this.handleChangeAddItem}
                  onClearAddItem={this.handleClearAddItem}
                />
              </div>
            )}
          />
        </div>
        {isEditing && (
          <div style={{ flexShrink: 0 }}>
            <PreviewFooter>
              <Button
                buttonStyle="ghost"
                onClick={this.handleClickAddAnother}
                style={{ marginRight: 10 }}
                disabled={addItemValue.trim() === ""}
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
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isEditing: selectors.getIsEditing(state),
});

export default connect(mapStateToProps, {
  onAddListItem: actions.requestAddListItem,
  onCancelEditing: actions.cancelEditing,
  onSetAddListItem: actions.setAddListItem,
  onUpdateNote: actions.requestUpdateNote,
})(ListPreview);
