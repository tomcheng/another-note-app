import React, { PropTypes, Component } from "react";

class SingleNote extends Component {
  static propTypes = {
    note: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  };

  render () {
    const { note } = this.props;

    return (
      <div>{note.title}</div>
    );
  }
}

export default SingleNote;
