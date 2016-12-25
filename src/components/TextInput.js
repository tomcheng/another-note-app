import React, { PropTypes, Component } from "react";
import omit from "lodash/omit";
import Textarea from "react-textarea-autosize";

class TextInput extends Component {
  static propTypes = {
    refCallback: PropTypes.func,
    singleLine: PropTypes.bool,
    style: PropTypes.object,
    onEnter: PropTypes.func,
  };

  handleChange = evt => {
    const { singleLine, onChange, onEnter } = this.props;
    const value = evt.target.value;

    if (!onChange) { return; }

    if (!singleLine) {
      onChange(evt);
      return;
    }

    if (onEnter && value.length && value[value.length - 1] === "\n") {
      onChange({ ...evt, target: {
        ...evt.target,
        value: value.replace(/\n/g, "").trim(),
      } });

      onEnter();
    } else {
      onChange({ ...evt, target: {
        ...evt.target,
        value: value.replace(/\n/g, "")
      } });
    }
  };

  render () {
    const { style, refCallback, ...other } = this.props;

    return (
      <Textarea
        {...omit(other, ["singleLine", "onEnter"])}
        onChange={this.handleChange}
        ref={refCallback}
        style={{
          display: "block",
          fontFamily: "inherit",
          lineHeight: "inherit",
          fontSize: "inherit",
          color: "inherit",
          resize: "none",
          padding: "3px 5px",
          ...style,
        }}
      />
    );
  };
}

export default TextInput;
