import React, { Component } from "react";
import Icon from "./Icon";

class NoteMenu extends Component {
  static propTypes = {};

  state = {
    menuOpen: false,
  };

  handleClickIcon = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  render () {
    const { menuOpen } = this.state;

    return (
      <div>
        <Icon
          icon="ellipsis-v"
          action
          onClick={this.handleClickIcon}
          style={{ color: menuOpen ? "red" : null }}
        />
      </div>
    );
  }
}

export default NoteMenu;
