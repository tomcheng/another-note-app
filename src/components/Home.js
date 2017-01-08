import React from "react";
import Search from "./Search";
import Notes from "./Notes";

const Home = () => (
  <div style={{
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}>
    <div style={{ flexShrink: 0 }}>
      <Search />
    </div>
    <div style={{ flexGrow: 1, overflow: "auto" }}>
      <Notes />
    </div>
  </div>
);

export default Home;
