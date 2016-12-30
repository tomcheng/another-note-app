import React, { PropTypes, Component } from "react";

class SingleList extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  };

  render () {
    const { list } = this.props;

    return (
      <div>{list.title}</div>
    );
  }
}

export default SingleList;
