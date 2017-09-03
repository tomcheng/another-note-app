import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import FancyIcon from "./FancyIcon";

const StyledLabel = styled.label`
  width: 100%;
  display: flex;
`;

const IconWrapper = styled.div`
  padding: 6px 6px 6px 0;
  opacity: ${props => (props.disabled ? "0.1" : "0.8")};
`;

class Checkbox extends Component {
  handleClick = () => {
    const { checked, onChange } = this.props;

    onChange({ target: { checked: !checked } });
  };

  render() {
    const { checked, label, disabled } = this.props;

    return (
      <StyledLabel>
        <IconWrapper onClick={this.handleClick} disabled={disabled}>
          <FancyIcon icon={checked ? "checked" : "unchecked"} />
        </IconWrapper>
        {label}
      </StyledLabel>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
};

export default Checkbox;
