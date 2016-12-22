import React, { PropTypes, Component } from "react";
import { actions, selectors } from "../reducer";
import { connect } from "react-redux";

const ENTER = 13;

class Search extends Component {
  static propTypes = {
    search: PropTypes.string.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onUpdateSearch: PropTypes.func.isRequired,
  };

  handleChangeSearch = ({ target }) => {
    this.props.onUpdateSearch(target.value);
  };

  handleKeyDown = evt => {
    switch (evt.keyCode) {
      case ENTER:
        this.props.onAddNote({ title: this.props.search });
        break;

      default:
        break;
    }
  };


  render () {
    const { search } = this.props;

    return (
      <input
        value={search}
        type="text"
        onChange={this.handleChangeSearch}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

const mapStateToProps = state => ({
  search: selectors.getSearch(state),
});

export default connect(mapStateToProps, {
  onAddNote: actions.requestAddNote,
  onUpdateSearch: actions.updateSearch,
})(Search);
