import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { withRouter } from "react-router";
import TextInput from "./TextInput";
import Button from "./Button";
import Card from "./Card";
import PreviewFooter from "./PreviewFooter";

class EditNote extends Component {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        focus: PropTypes.string,
        just_added: PropTypes.string,
      }).isRequired,
    }).isRequired,
    note: PropTypes.shape({
      body: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    router: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    onDeleteNote: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    const { note } = props;

    this.state = {
      body: note.body,
      title: note.title,
    };
  }

  componentDidMount () {
    switch (this.props.location.query.focus) {
      case "body":
        this.bodyField.focus();
        break;
      case "title":
        this.titleField.focus();
        break;
      default:
        break;
    }
  }

  handleChangeTitle = ({ target }) => {
    this.setState({ title: target.value });
  };

  handleChangeBody = ({ target }) => {
    this.setState({ body: target.value });
  };

  handleEnterTitle = () => {
    this.bodyField.focus();
  };

  handleClickCancel = () => {
    const { note, location, onDeleteNote, router } = this.props;

    if (location.query.just_added === "true") {
      onDeleteNote({
        id: note.id,
        callback: () => {
          router.goBack();
          router.goBack();
        },
      })
    } else {
      router.goBack();
    }
  };

  handleClickDone = () => {
    const { note, onUpdateNote, router } = this.props;

    onUpdateNote({
      id: note.id,
      updates: this.state,
      callback: () => { router.goBack(); },
    });
  };

  render () {
    const { title, body } = this.state;

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
          padding: 6,
        }}>
          <Card
            header={(
              <div style={{ padding: "7px 7px 0" }}>
                <TextInput
                  value={title}
                  placeholder="Add Title"
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
              <div style={{ padding: "2px 7px 7px" }}>
                <TextInput
                  name="body"
                  value={body}
                  placeholder="Add Description"
                  refCallback={el => { this.bodyField = el; }}
                  onChange={this.handleChangeBody}
                  minRows={2}
                  style={{
                    width: "100%",
                    padding: "5px 8px",
                  }}
                />
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
              onClick={this.handleClickCancel}
            >
              Cancel
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
  onUpdateNote: actions.requestUpdateNote,
  onDeleteNote: actions.requestDeleteNote,
})(EditNote));
