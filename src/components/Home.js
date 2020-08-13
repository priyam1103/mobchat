import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import { navigate } from "@reach/router";
import { removeUser } from "../redux/user/action";
const Home = (props) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const token = localStorage.getItem("mobchat_token");
    if (!token) {
      navigate("/signup");
    }
  }, []);

  const handleLogout = () => {
    navigate("/signin");
    dispatch(removeUser());
  };

  return (
    <div>
      <span style={{ color: "red" }}>{user.username}</span>
      {props.user.token}
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(Home);
