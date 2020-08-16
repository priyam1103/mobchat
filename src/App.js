import { Router, Redirect } from "@reach/router";
import React, { Suspense } from "react";
import "./App.css";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { addUser } from "./redux/user/action";

import Otp from "./components/Otp";
import SignUp from "./components/SignUp";
import axios from "axios";
import "./components/loader.css";
import Signin from "./components/Signin";
import ResetPassword from "./components/ResetPassword";
import Reset from "./components/Reset";
import Chat from "./components/Chat";
import Error from "./components/Error";
import Chatroom from "./components/Chatroom";
let newSocket;

const App = () => {
  // const [socket, setSocket] = React.useState(null);
  const dispatch = useDispatch();
  const [newwSocket, setSocket] = React.useState(null);
  //const token = useSelector((state) => state.user.token);
  React.useEffect(() => {
    document.title = "Mobchat";

    const token = localStorage.getItem("mobchat_token");

    if (token) {
      axios
        .get("https://mobchat-2020.herokuapp.com/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          dispatch(addUser({ token: token, user_: res.data.user_ }));
        })
        .catch((err) => {
          if (err) {
            localStorage.removeItem("mobchat_token");
          }
        });
    } else {
      // navigate("/signin");
    }
  }, []);

  const setUpSocket = () => {
    const token = localStorage.getItem("mobchat_token");

    if (token && !newwSocket) {
      newSocket = io("http://localhost:3001", {
        query: {
          token: localStorage.getItem("mobchat_token"),
        },
      });

      newSocket.on("connect", () => {
        alert("connected");
      });

      newSocket.on("disconnect", () => {});
      setSocket(newSocket);
      return newSocket;
    }
  };
  return (
    <Suspense fallback={<div className="loader"></div>}>
      <Router>
        <Redirect from="*" to="error" />
        <SignUp path="/signup" />
        <Otp path="/otp" />

        <Signin path="/signin" />
        <Chatroom
          path="/"
          exact
          setUpSocket={setUpSocket}
          newSocket={newSocket}
        />
        <Reset path="reset-password" />
        <ResetPassword path="resetPassword" />
        <Chat path="/chat" newSocket={newwSocket} />
        <Error path="/error" />
      </Router>
    </Suspense>
  );
};

export default App;
