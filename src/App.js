import React, { Component, PropTypes } from 'react';
import { connect } from "react-redux";
import { actions, selectors } from "./reducer";
import Draggable from "react-draggable";
import Search from "./components/Search";
import Notes from "./components/Notes";
import Preview from "./components/Preview";
import './App.css';

class App extends Component {
  static propTypes = {
    listHeight: PropTypes.number.isRequired,
    onSetListHeight: PropTypes.func.isRequired,
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
    const { listHeight } = this.props;
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
          <Draggable
            axis="y"
            onDrag={this.handleDrag}
            defaultPosition={{ x: 0, y: listHeight }}
          >
            <div
              style={{
                height: 40,
                top: -20,
                left: 0,
                right: 0,
                position: "absolute",
                zIndex: 1,
              }}
            />
          </Draggable>
          <Notes containerStyle={{ flexShrink: 0 }} />
          <Preview containerStyle={{ flexGrow: 1 }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  listHeight: selectors.getListHeight(state),
});

export default connect(mapStateToProps, {
  onSetListHeight: actions.setListHeight,
})(App);
