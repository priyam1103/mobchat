import React from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./redux/user/action";
import { Router, Link, navigate, Redirect } from "@reach/router";
import Otp from "./components/Otp";
import SignUp from "./components/SignUp";
import axios from "axios";
import Signin from "./components/Signin";
import Home from "./components/Home";
const App = () => {
  const dispatch = useDispatch();
  //const token = useSelector((state) => state.user.token);
  React.useEffect(() => {
    const token = localStorage.getItem("mobchat_token");
    console.log(token);
    if (token) {
      axios
        .get("http://localhost:3001/user/me", {
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
  return (
    <Router>
      <SignUp path="/signup" />
      <Otp path="/otp" />
      <Home path="/" exact />
      <Signin path="/signin" />
    </Router>
  );
};

export default App;
