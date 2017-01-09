import React, { PropTypes } from "react";
import Notes from "./Notes";

const Home = ({ isVisible }) => (
  <div style={{
    flexGrow: 1,
    display: isVisible ? "flex" : "none",
    flexDirection: "column",
    overflow: "hidden",
  }}>
    <div style={{ flexGrow: 1, overflow: "auto" }}>
      <Notes />
    </div>
  </div>
);

Home.PropTypes = {
  isVisible: PropTypes.bool.isRequired, // Optimize for less re-rendering
};

export default Home;
