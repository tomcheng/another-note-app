import React from "react";
import Notes from "./Notes";

const Home = () => (
  <div style={{
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}>
    <div style={{ flexGrow: 1, overflow: "auto" }}>
      <Notes />
    </div>
  </div>
);

export default Home;
