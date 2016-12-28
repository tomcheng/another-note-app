import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Button from "./Button";
import PreviewHeader from "./PreviewHeader";
import PreviewFooter from "./PreviewFooter";
import ListManager from "./ListManager";

class ListPreview extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    selectedNote: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    onAddNote: PropTypes.func.isRequired,
    onCancelEditing: PropTypes.func.isRequired,
    onSetAddListItem: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    const { selectedNote } = props;

    this.state = {
      title: selectedNote.title,
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

  handleBlurTitle = () => {
    const { onUpdateNote, selectedNote } = this.props;
    const { title } = this.state;

    if (title !== selectedNote.title) {
      onUpdateNote({
        id: selectedNote.id,
        updates: { title },
      });
    }
  };

  handleEnterTitle = () => {
    this.props.onSetAddListItem();
  };

  handleClickDone = () => {
    this.props.onCancelEditing();
  };

  renderCardContent = () => {
    const { selectedNote } = this.props;

    return (
      <div style={{ margin: "7px 12px 10px" }}>
        <ListManager list={selectedNote} />
      </div>
    );
  };

  render () {
    const { isEditing } = this.props;
    const { title } = this.state;

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
          <div style={{
            backgroundColor: "#fff",
            backgroundClip: "padding-box",
            border: "1px solid rgba(0,0,0,0.1)",
            overflow: "hidden",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ flexShrink: 0 }}>
              <PreviewHeader
                title={title}
                onBlurTitle={this.handleBlurTitle}
                onChangeTitle={this.handleChangeTitle}
                onEnter={this.handleEnterTitle}
              />
            </div>
            <div style={{ flexShrink: 1, overflow: "auto" }}>
              {this.renderCardContent()}
            </div>
          </div>
        </div>
        {isEditing && (
          <div style={{ flexShrink: 0 }}>
            <PreviewFooter>
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
  onAddNote: actions.requestAddNote,
  onCancelEditing: actions.cancelEditing,
  onSetAddListItem: actions.setAddListItem,
  onUpdateNote: actions.requestUpdateNote,
})(ListPreview);
