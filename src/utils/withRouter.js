import React, { Component, PropTypes } from "react";

const withRouter = Target => class extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render () {
    const { router } = this.context;

    return (
      <Target
        {...this.props}
        router={{
          ...router,
          goBack: window.history.back.bind(window.history),
        }}
      />
    );
  }
};

export default withRouter;
