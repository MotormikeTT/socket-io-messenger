import { Typography } from "@material-ui/core";
import React from "react";
import "../App.css";

const ChatMsg = (props) => {
  let msg = props.msg;
  return (
    <div className="scenario-message" style={{ backgroundColor: msg.colour }}>
      <Typography style={{ fontSize: 12 }}>
        {msg.from} Says @{msg.at}:
      </Typography>
      <Typography>{msg.text}</Typography>
    </div>
  );
};
export default ChatMsg;
