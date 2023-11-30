import { useEffect, useRef } from "react";
import { ListItem } from "@material-ui/core";
import Bubble from "./bubble";
import Triangle from "./triangle";

const UserBubble = (props) => {
  const userRef = useRef(null);
  useEffect(() => {
    userRef.current.scrollIntoView(true);
  }, []);
  return (
    <div>
      <ListItem
        ref={userRef}
        style={{
          textAlign: "left",
          marginBottom: "5px",
          width: "70%",
          marginLeft: props.message.isMe ? "auto" : "7%",
          paddingLeft: 0,
          paddingRight: 0,
          display: "inherit",
        }}
      >
        <Bubble message={props.message} />
        <Triangle
          colour={props.message.colour}
          alignTriangle={props.message.isMe ? "78%" : 0}
        />
      </ListItem>
      <p></p>
    </div>
  );
};
export default UserBubble;
