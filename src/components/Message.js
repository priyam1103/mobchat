import React from "react";

const Message = ({ msg, time, date, flag }) => {
  return (
    <div>
      {flag ? (
        <div
          style={{
            backgroundColor: "#ff6666",
            marginBottom: 20,
            paddingLeft: 10,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <p
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginRight: 10,
            }}
          >
            {msg}

            <span
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                paddingTop: "20px",
              }}
            >
              <span style={{ fontSize: "10px" }}>{time}</span>
            </span>
          </p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#ff8566",
            marginBottom: 20,
            paddingLeft: 10,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <p
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: 10,
            }}
          >
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                paddingTop: "20px",
              }}
            >
              <span style={{ fontSize: "10px" }}>{time}</span>
            </span>
            {msg}
          </p>
        </div>
      )}
    </div>
  );
};
export default Message;
