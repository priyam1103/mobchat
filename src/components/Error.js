import React from "react";
import { navigate } from "@reach/router";
const Error = () => {
  React.useEffect(() => {
    if (localStorage.getItem("mobchat_token")) {
      navigate("/");
    } else {
      navigate("/signin");
    }
  });
  return <div></div>;
};
export default Error;
