import React, { Component, PropTypes } from 'react';
import { connect } from "react-redux";
import { actions, selectors } from "../reducer";
import Search from "./Search";
import Notes from "./Notes";
import Preview from "./Preview";
import SectionDivider from "./SectionDivider";

class App extends Component {
  static propTypes = {
    listHeight: PropTypes.number.isRequired,
    onSetListHeight: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      appHeight: window.innerHeight,
    };
  }

  componentDidMount () {
    window.addEventListener("resize", () => {
      this.setState({ appHeight: window.innerHeight });
    })
  };

  handleDrag = (e, ui) => {
    this.props.onSetListHeight({ height: ui.y });
  };

  render () {
    const { listHeight, isEditing } = this.props;
    const { appHeight } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: appHeight,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <Search />
        </div>
        <div style={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          <SectionDivider
            listHeight={listHeight}
            isEditing={isEditing}
            onDrag={this.handleDrag}
          />
          <Notes containerStyle={{ flexShrink: 0 }} />
          <Preview containerStyle={{ flexGrow: 1, marginTop: 10 }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  listHeight: selectors.getListHeight(state),
  isEditing: selectors.getIsEditing(state),
});

export default connect(mapStateToProps, {
  onSetListHeight: actions.setListHeight,
})(App);
