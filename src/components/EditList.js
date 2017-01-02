import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { actions } from "../reducer";
import { withRouter } from "react-router";
import TextInput from "./TextInput";
import Button from "./Button";
import Card from "./Card";
import PreviewFooter from "./PreviewFooter";

class EditList extends Component {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        focus: PropTypes.string,
      }).isRequired,
    }).isRequired,
    list: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    router: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    const { list } = props;

    this.state = {
      title: list.title,
    };
  }

  componentDidMount () {
    switch (this.props.location.query.focus) {
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

  handleClickDone = () => {
    const { list, onUpdateNote } = this.props;

    onUpdateNote({
      id: list.id,
      updates: this.state,
      callback: this.redirect,
    });
  };

  redirect = () => {
    this.props.router.goBack();
  };

  render () {
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
                  fontWeight: 600,
                }}
                singleLine
              />
            )}
            body={(
              <div>List items go here.</div>
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
})(EditList));
