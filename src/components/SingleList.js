import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import Card from "./Card";

class SingleList extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  };

  render () {
    const { list } = this.props;

    return (
      <Card
        header={(
          <Link to="/" style={{ display: "block", padding: "10px 12px", fontWeight: 600 }}>
            {list.title}
          </Link>
        )}
        body={(
          <div style={{ padding: "10px 12px 12px", minHeight: 66 }}>
            {list.items.map(({ id, value }) => (
              <div key={id}>
                {value}
              </div>
            ))}
          </div>
        )}
      />
    );
  }
}

export default SingleList;
