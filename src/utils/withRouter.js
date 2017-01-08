import React, { Component, PropTypes } from "react";

const withRouter = Target => class extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render () {
    return <Target {...this.props} router={this.context.router} />;
  }
};

export default withRouter;
