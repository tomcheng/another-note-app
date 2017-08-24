import PropTypes from "prop-types";
import React, { Component } from "react";
import FancyIcon from "./FancyIcon";
import PopoverItem from "./PopoverItem";

class ShowMenu extends Component {
  static propTypes = {
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        action: PropTypes.func.isRequired
      })
    ).isRequired
  };

  state = { menuOpen: false };

  handleClickIcon = () => {
    this.setState({ menuOpen: true });
  };

  handleClickOverlay = () => {
    this.setState({ menuOpen: false });
  };

  performAction = action => {
    action();

    this.setState({ menuOpen: false });
  };

  render() {
    const { menuItems } = this.props;
    const { menuOpen } = this.state;

    return (
      <div style={{ position: "relative" }}>
        <div
          onClick={this.handleClickIcon}
          style={{ padding: 9, cursor: "pointer" }}
        >
          <FancyIcon icon="vertical-ellipsis" />
        </div>
        {menuOpen &&
          <div style={{ color: "#222" }}>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              onClick={this.handleClickOverlay}
            />
            <div
              style={{
                position: "absolute",
                top: 48,
                right: -2,
                backgroundColor: "#fff",
                boxShadow:
                  "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                zIndex: 1
              }}
            >
              {menuItems.map(({ action, label }) =>
                <PopoverItem
                  key={label}
                  onClick={() => {
                    this.performAction(action);
                  }}
                >
                  {label}
                </PopoverItem>
              )}
            </div>
          </div>}
      </div>
    );
  }
}

export default ShowMenu;
