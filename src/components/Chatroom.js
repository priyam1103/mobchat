import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { navigate } from "@reach/router";
import { removeUser } from "../redux/user/action";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import "./screen.css";
import "./loader.css";

import Users from "../components/Users";
import Chat from "../components/Chat";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Chatroom = ({ setUpSocket, newSocket }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [socket, setSocket] = React.useState({});
  const [recv, setRecv] = React.useState({});
  const [chatbox, setChatBox] = React.useState(false);
  const [users, setUsers] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [ssearch, setSSearch] = React.useState(false);
  const [temp, setTemp] = React.useState({});
  const [showchat, setShowChat] = React.useState(false);
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("mobchat_token");

    if (!token) {
      navigate("/signin");
    } else {
      setSocket(setUpSocket());

      handleRefresh();
    }
  }, []);
  useEffect(() => {
    const cleanup = () => {
      const token = localStorage.getItem("mobchat_token");
      if (!token && user.token === null && newSocket === undefined) {
        navigate("/signin");
      }
    };
    window.addEventListener("load", cleanup);

    return () => {
      window.removeEventListener("load", cleanup);
    };
  }, []);

  const handleRefresh = () => {
    const token = localStorage.getItem("mobchat_token");
    if (token) {
      axios
        .get("https://mobchat-2020.herokuapp.com/details/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsers(res.data.users);
          setTemp(res.data.users);
          setLoading(false);
        })
        .catch((err) => {
          localStorage.setItem("mobchat_token", null);
          dispatch(removeUser());
          navigate("/signin");
          setLoading(false);
        });
    }
  };

  const handleLogout = () => {
    navigate("/signin");
    dispatch(removeUser());
  };
  const handleChat = (num) => {
    setRecv(num);
    setShowChat(true);
    setChatBox(true);
  };
  React.useEffect(() => {
    if (search === "") {
      setSSearch(false);
      setUsers(temp);
    } else {
      setSSearch(true);
      const fillteredData = temp.filter((find) =>
        find.username.toLowerCase().includes(search)
      );

      setUsers(fillteredData);
    }
  }, [search]);
  return (
    <>
      {window.innerWidth < 500 ? (
        <>
          {!loading ? (
            <>
              <div
                style={{
                  backgroundColor: "#3b3b38",
                  overflow: "hidden",
                  maxHeight: window.innerHeight,
                }}
              >
                <>
                  <div
                    style={{
                      paddingTop: window.innerHeight / 55,
                      paddingLeft: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          color: "#ffcccc",
                          fontWeight: 10,
                          paddingTop: 10,
                          paddingLeft: window.innerWidth / 22,
                        }}
                      >
                        {user.user.username}'s chat room !!
                      </span>

                      <button
                        style={{
                          marginRight: window.innerWidth / 15,
                          backgroundColor: "#e6e6e6",
                          borderRadius: 5,
                          padding: 5,
                        }}
                        onClick={handleLogout}
                      >
                        logout
                      </button>
                    </div>
                  </div>
                </>

                <div
                  style={{
                    paddingTop: "5%",
                    paddingLeft: window.innerWidth / 20,
                    paddingRight: window.innerWidth / 20,
                  }}
                >
                  {!showchat ? (
                    <div>
                      <input
                        type="text"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      ></input>

                      <>
                        <div
                          className="userscreen"
                          style={{
                            maxHeight: window.innerHeight / 1.2,
                            paddingBottom: "200%",
                          }}
                        >
                          {user.user ? (
                            <>
                              {Object.keys(users).map((key) => (
                                <>
                                  {users[key].verified ? (
                                    <div key={key}>
                                      <Users
                                        user={users[key]}
                                        handleChat={handleChat}
                                        newSocket={socket}
                                        currentUser={user.user}
                                        search={ssearch}
                                      />
                                    </div>
                                  ) : null}
                                </>
                              ))}
                            </>
                          ) : (
                            <div
                              className="userscreen"
                              style={{
                                maxHeight: window.innerHeight / 1.2,
                                paddingBottom: "10%",
                              }}
                            ></div>
                          )}
                        </div>
                      </>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: window.innerWidth / 1.1,
                        marginRight: "5%",
                      }}
                    >
                      <>
                        <FontAwesomeIcon
                          onClick={() => {
                            setShowChat(false);
                          }}
                          icon={faLongArrowAltLeft}
                          style={{
                            fontSize: "40px",

                            cursor: "pointer",
                          }}
                        />
                        {chatbox ? (
                          <div>
                            <Chat
                              sender={user.user}
                              reciever={recv}
                              newSocket={socket}
                              user={user}
                            />
                          </div>
                        ) : null}
                      </>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="loader"></div>
          )}
        </>
      ) : (
        <>
            {!loading ? (
              
            <div
              style={{
                backgroundColor: "#3b3b38",
                overflow: "hidden",
                maxHeight: window.innerHeight,
              }}
            >
           
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                    
                  height: window.innerHeight,
                    
              
                
                }}
              >
                  <div style={{ width: "25%" }}>
                    {user && (
                        <div style={{margin:0,padding:0,display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                        <p style={{ padding: 0, margin: "3px", fontSize: 20 }}>Logged in as <span style={{ color: "#ff8080" }}>{user.user.username}</span></p>
                        <p style={{ padding: 0, margin: "3px", fontSize: 15,textDecoration:"underline",cursor:"pointer" }} onClick={handleLogout}>Logout</p>
                      </div>
                    )}
                  
                  <input
                      type="text"
                      placeholder="Search for user"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  ></input>

                  <div className="userscreen">
                    {user.user ? (
                      <>
                        {Object.keys(users).map((key) => (
                          <div key={key}>
                            {users[key].verified ? (
                              <div key={key}>
                                <Users
                                  user={users[key]}
                                  handleChat={handleChat}
                                  newSocket={socket}
                                  currentUser={user.user}
                                  search={ssearch}
                                />
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </>
                    ) : null}
                  </div>
                </div>
                < div
                  style={{
                    width: "70%",
                    marginLeft: "3%",
                  }}
                >
                  {chatbox ? (
                    <div className="dj-hei">
                      <Chat
                        sender={user.user}
                        reciever={recv}
                        newSocket={socket}
                        user={user}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="loader" style={{ margin: "5%" }}></div>
          )}
        </>
      )}
    </>
  );
};

export default Chatroom;
