import React from "react";
import io from "socket.io-client";

const Chatroom = ({ match }) => {
  const id = match.params.id;
  const socket = io("http://localhost:3001", {
    query: {
      token: localStorage.getItem("mobchat_token"),
    },
  });
  return <div>From chatroom !!!</div>;
};

export default Chatroom;
