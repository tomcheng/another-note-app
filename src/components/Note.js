import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";
import colors from "../styles/colors";
import FancyIcon from "./FancyIcon";

const StyledContainer = styled.div`
  background-clip: padding-box;
  padding: 0 12px 0 9px;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 3px;
  align-items: center;
  white-space: nowrap;
  height: 50px;
  display: ${props => props.isVisible ? "flex" : "none"};
`;

const StyledIconWrapper = styled.div`
  margin-right: 6px;
  opacity: 0.8;
`;

const StyledTitle = styled.div`
  font-weight: 500;
  flex-shrink: 1;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledSummary = styled.div`
  flex-grow: 1;
  flex-shrink: 1000000;
  opacity: 0.3;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-right: 10px;
`;

const StyledUpdatedAt = styled.div`
  font-size: 12px;
  opacity: 0.3;
`;

class Note extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    note: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      body: PropTypes.string,
      checkedItems: PropTypes.array,
      unCheckedItems: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string
        })
      )
    }).isRequired
  };

  getTitle = () => {
    const { note } = this.props;

    if (note.type === "list") {
      const totalItems = note.checkedItems.length + note.uncheckedItems.length;
      const completedItems = note.checkedItems.length;
      const remaining = totalItems - completedItems;
      return note.title + (remaining ? " (" + remaining + " left)" : "");
    }

    return note.title;
  };

  getSummary = () => {
    const { note } = this.props;

    if (note.type === "list") {
      return note.uncheckedItems.map(item => item.value).join(", ");
    }

    return note.body;
  };

  getUpdatedAt = () => {
    const { note } = this.props;

    if (moment().isSame(note.updatedAt, "day")) {
      return moment(note.updatedAt).fromNow();
    }

    if (moment().subtract(1, "days").isSame(note.updatedAt, "day")) {
      return "Yesterday at " + moment(note.updatedAt).format("h:mma");
    }

    return moment(note.updatedAt).format("MMM D, YYYY");
  };

  render() {
    const { note, isVisible } = this.props;
    const summary = this.getSummary();

    return (
      <StyledContainer isVisible={isVisible}>
        <StyledIconWrapper>
          <FancyIcon icon={note.type} color="#222" />
        </StyledIconWrapper>
        <StyledTitle>
          {this.getTitle()}&nbsp;
        </StyledTitle>
        {summary.trim() !== ""
          ? <StyledSummary>
              &ndash; {this.getSummary()}
            </StyledSummary>
          : <div style={{ flexGrow: 1 }} />}
        {note.pinned &&
          <div style={{ opacity: 0.8 }}>
            <FancyIcon icon="pin" color={colors.darkYellow} />
          </div>}
        {!note.pinned &&
          <StyledUpdatedAt>
            {this.getUpdatedAt()}
          </StyledUpdatedAt>}
      </StyledContainer>
    );
  }
}

export default Note;
