import React, { PropTypes, Component } from "react";

class ListManager extends Component {
  static propTypes = {
    list: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  };

  render () {
    const { list } = this.props;
    return (
      <div>
        {list.items.map(({ id, value }) => (
          <div key={id}>
            {value}
          </div>
        ))}
      </div>
    );
  }
}

export default ListManager;
