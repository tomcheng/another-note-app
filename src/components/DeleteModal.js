import PropTypes from "prop-types";
import React from "react";
import capitalize from "lodash/capitalize";
import CSSTransition from "react-addons-css-transition-group";
import renderOutside from "../utils/renderOutside";
import Button from "./Button";
import "./DeleteModal.css";

const DeleteModal = ({ isOpen, noteType, onClose, onDelete }) =>
  <CSSTransition
    transitionName="modal"
    transitionEnterTimeout={600}
    transitionLeaveTimeout={600}
  >
    {isOpen &&
      <div>
        <div
          className="modalOverlay"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1
          }}
          onClick={onClose}
        />
        <div
          className="modalContent"
          style={{
            backgroundColor: "#fff",
            position: "fixed",
            top: 100,
            left: "50%",
            marginLeft: -150,
            width: 300,
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            borderRadius: 2,
            padding: "15px 20px 20px",
            zIndex: 1
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Are you sure?</h3>
          <div style={{ marginBottom: 20 }}>
            Deleting this {noteType} cannot be undone.
          </div>
          <div style={{ textAlign: "right" }}>
            <Button buttonStyle="link" onClick={onClose}>
              cancel
            </Button>
            <Button buttonStyle="danger" onClick={onDelete}>
              Delete {capitalize(noteType)}
            </Button>
          </div>
        </div>
      </div>}
  </CSSTransition>;

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  noteType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default renderOutside(DeleteModal);
