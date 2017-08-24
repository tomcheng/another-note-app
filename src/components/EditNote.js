import React, { Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import queryString from "query-string";
import TextInput from "./TextInput";
import Button from "./Button";
import Card from "./Card";
import PreviewFooter from "./PreviewFooter";

class EditNote extends Component {
  static propTypes = {
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
      string: PropTypes.string
    }).isRequired,
    note: PropTypes.shape({
      body: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    onDeleteNote: PropTypes.func.isRequired,
    onUpdateNote: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { note } = props;

    this.state = {
      body: note.body,
      title: note.title
    };
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search);

    switch (query.focus) {
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
    const { note, onDeleteNote, history } = this.props;
    const query = queryString.parse(this.props.location.search);

    if (query.just_added === "true") {
      onDeleteNote({
        id: note.id,
        callback: () => {
          history.goBack();
        }
      });
    } else {
      history.goBack();
    }
  };

  handleClickDone = () => {
    const { note, onUpdateNote, history } = this.props;
    const query = queryString.parse(this.props.location.search);

    onUpdateNote({
      id: note.id,
      updates: this.state,
      callback: () => {
        if (query.just_added === "true") {
          history.replace("/" + note.id);
        } else {
          history.goBack();
        }
      }
    });
  };

  handleBlur = event => {
    if (!event.relatedTarget) {
      this.handleClickDone();
    }
  };

  render() {
    const { title, body } = this.state;

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
          style={{
            flexGrow: 1,
            overflow: "auto"
          }}
        >
          <div style={{ padding: 6 }}>
            <Card
              header={
                <div style={{ padding: "7px 7px 0" }}>
                  <TextInput
                    value={title}
                    placeholder="Add Title"
                    refCallback={el => {
                      this.titleField = el;
                    }}
                    onChange={this.handleChangeTitle}
                    onEnter={this.handleEnterTitle}
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
                <div style={{ padding: "2px 7px 7px" }}>
                  <TextInput
                    name="body"
                    value={body}
                    placeholder="Add Description"
                    refCallback={el => {
                      this.bodyField = el;
                    }}
                    onChange={this.handleChangeBody}
                    onBlur={this.handleBlur}
                    minRows={2}
                    style={{
                      width: "100%",
                      padding: "5px 8px"
                    }}
                  />
                </div>
              }
            />
          </div>
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
            <Button buttonStyle="ghost" onClick={this.handleClickDone}>
              Done
            </Button>
          </PreviewFooter>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(null, {
    onUpdateNote: actions.requestUpdateNote,
    onDeleteNote: actions.requestDeleteNote
  })(EditNote)
);
