import React from "react";
import "./screen.css";
const Infobar = ({ reciever, typing }) => {
  return (
    <div
      className="screensty"
      style={{
        backgroundColor: "#ffcccc",
        paddingLeft: 5,

        marginBottom: 2,
      }}
    >
      <h3 style={{ color: "black", fontWeight: 10 }}> {reciever}</h3>
      <h5 style={{ color: "black" }}>{typing}</h5>
    </div>
  );
};
export default Infobar;
