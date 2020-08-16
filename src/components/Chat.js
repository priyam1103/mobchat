import React, { useEffect } from "react";
import { navigate } from "@reach/router";
import { useSelector } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import "./screen.css";
import Message from "./Message";

import Infobar from "./Infobar";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Chat = ({ newSocket, reciever, user }) => {
  const [mssg, setMssg] = React.useState();
  const sender = useSelector((state) => state.user.user);
  const [messages, setMessages] = React.useState({});
  const [typing, setTyping] = React.useState(null);
  const [chatId, setC1] = React.useState();
  const [chatId2, setC2] = React.useState();
  //const chatId = sender._id + reciever._id;
  //const chatId2 = reciever._id + sender._id;

  useEffect(() => {
    if (!newSocket) {
      navigate("/");
    } else {
      setC1(sender._id + reciever._id);
      setC2(reciever._id + sender._id);
      newSocket.on("chatMessage", (data) => {
        if (
          data._id === sender._id + reciever._id ||
          data._id === reciever._id + sender._id
        ) {
          setMessages(data.message);
        }
      });
      newSocket.emit(
        "getChat",
        { sender: sender, recv: reciever },
        ({ chat }) => {
          setMessages(chat);
        }
      );

      // newSocket.on("userTyping", (data) => {
      //   // console.log(chatId);
      //   if (
      //     data.chatId === sender._id + reciever._id ||
      //     data.chatId === reciever._id + sender._id
      //   ) {
      //     setTyping(`typing......`);
      //   } else {
      //     console.log(data);
      //   }
      // });

      // newSocket.on("stopTyping", (data) => {
      //   if (data.chatId === chatId || data.chatId === chatId2) {
      //     setTyping(``);
      //   }
      // });
    }
  }, [chatId, sender, newSocket, reciever, typing]);

  useEffect(() => {
    const cleanup = () => {
      if (mssg != "") {
        newSocket.emit("stopTyping", {
          chatId: chatId,
          sender: sender,
          recv: reciever,
        });
      }
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  const handleChange = (value) => {
    setMssg(value);
    newSocket.emit("userTyping", {
      chatId: chatId,
      sender: sender,
      recv: reciever,
    });
  };
  const handleSend = () => {
    newSocket.emit("chatMesssage", {
      chatId: chatId,
      sender: sender,
      recv: reciever,
      mssg: mssg,
    });
    setMssg("");
  };
  useEffect(() => {
    if (mssg === "") {
      newSocket.emit("stopTyping", {
        chatId: chatId,
        sender: sender,
        recv: reciever,
      });
    } else {
    }
  }, [mssg, chatId, sender, reciever]);
  return (
    <div>
      <Infobar reciever={reciever.username} typing={typing} />
      <div
        style={{
          height: window.innerHeight / 1.7,
        }}
      >
        <ScrollToBottom className="chatscreen">
          {Object.keys(messages).map((a) => (
            <div
              key={a}
              style={{
                backgroundColor: "#3b3b38",
                justifyContent: "space-between",
              }}
            >
              {messages[a].sender === user.user._id ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: "10px",
                  }}
                >
                  <Message
                    msg={messages[a].message}
                    time={messages[a].time}
                    date={messages[a].date}
                    flag={true}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginLeft: "10px",
                  }}
                >
                  <Message
                    msg={messages[a].message}
                    time={messages[a].time}
                    flag={false}
                  />
                </div>
              )}
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div
        style={{ flexDirection: "row", display: "flex", paddingBottom: "10%" }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={mssg}
          onChange={({ target: { value } }) => handleChange(value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? handleSend(event) : null
          }
        />
        <FontAwesomeIcon
          onClick={handleSend}
          icon={faPaperPlane}
          style={{ fontSize: "50px", paddingTop: 10, cursor: "pointer" }}
        />
      </div>
    </div>
  );
};
export default Chat;
