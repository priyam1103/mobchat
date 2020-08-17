import React from "react";
import { useSelector } from "react-redux";
import "./screen.css";
import "./loader.css";
const Users = ({ user, handleChat, newSocket, search }) => {
  const [lastMessage, setLastMessage] = React.useState("");
  const currentUser = useSelector((state) => state.user);
  const [typing, setTyping] = React.useState();
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    if (newSocket) {
      setLoading(false);
      newSocket.emit("lastMessage", {
        currentUser: currentUser.user,
        user: user,
      });
      newSocket.on("lastMessage", (data) => {
        if (data.message.length) {
          if (
            data._id === currentUser.user._id + user._id ||
            data._id === user._id + currentUser.user._id
          ) {
            setLastMessage(data.message[data.message.length - 1].message);
          }
        }
      });
      newSocket.on("chatMessage", (data) => {
        if (data.message.length) {
          if (
            data._id === currentUser.user._id + user._id ||
            data._id === user._id + currentUser.user._id
          ) {
            setLastMessage(data.message[data.message.length - 1].message);
          }
        }
      });
      newSocket.on("userTyping", (data) => {
        if (
          data.chatId === currentUser.user._id + user._id ||
          data.chatId === user._id + currentUser.user._id
        ) {
          setTyping(`typing......`);
        } else {
        }
      });
      newSocket.on("stopTyping", (data) => {
        if (
          data.chatId === currentUser.user._id + user._id ||
          data.chatId === user._id + currentUser.user._id
        ) {
          setTyping(``);
        }
      });
    }
  }, [currentUser, newSocket, user]);
  return (
    <>
      {!loading ? (
        <div
          onClick={() => {
            handleChat(user);
          }}
          style={{
            paddingLeft: 10,
            backgroundColor: "#e6e6e6",
            cursor: "pointer",
            border: "10px",
            borderRadius: 10,
            borderWidth: 50,
            borderColor: "red",
          }}
        >
          <h3 style={{ fontSize: "20px", fontWeight: 15, color: "black" }}>
            {user.username}
          </h3>
          {!search ? (
            <>
              {typing ? (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    fontSize: "15px",
                    color: "#303030",
                  }}
                >
                  {typing}
                </p>
              ) : (
                <p
                  style={{
                    marginTop: 0,
                    paddingTop: 0,
                    display: "flex",
                    justifyContent: "flex-end",
                    fontSize: "15px",
                    color: "#B00000",
                    paddingRight: 8,
                  }}
                >
                  {lastMessage ? lastMessage.substring(0, 10) : null}
                </p>
              )}
            </>
          ) : null}
        </div>
      ) : (
        <div className="lloader"></div>
      )}
    </>
  );
};
export default Users;
