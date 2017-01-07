import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { actions } from "../reducer";
import FancyIcon from "./FancyIcon";
import PopoverItem from "./PopoverItem";

class ListMenu extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf(["list", "note"]).isRequired,
      hideChecked: PropTypes.bool,
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    onUpdateNote: PropTypes.func.isRequired,
  };

  state = { menuOpen: false };

  handleClickIcon = () => {
    this.setState({ menuOpen: true });
  };

  handleClickOverlay = () => {
    this.setState({ menuOpen: false });
  };

  handleToggleHideChecked = () => {
    const { onUpdateNote, list } = this.props;

    onUpdateNote({
      id: list.id,
      updates: { hideChecked: !list.hideChecked },
    });

    this.setState({ menuOpen: false });
  };

  render () {
    const { list } = this.props;
    const { menuOpen } = this.state;

    return (
      <div style={{ position: "relative" }}>
        <div
          onClick={this.handleClickIcon}
          style={{ padding: 9, cursor: "pointer" }}
        >
          <FancyIcon icon="vertical-ellipsis" />
        </div>
        {menuOpen && (
          <div style={{ color: "#222" }}>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onClick={this.handleClickOverlay}
            />
            <div style={{
              position: "absolute",
              top: 48,
              right: -2,
              backgroundColor: "#fff",
              boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
              zIndex: 1,
            }}>
              <PopoverItem onClick={this.handleToggleHideChecked}>
                {list.hideChecked ? "Show completed items" : "Hide completed items"}
              </PopoverItem>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(connect(null, {
  onUpdateNote: actions.requestUpdateNote,
})(ListMenu));
