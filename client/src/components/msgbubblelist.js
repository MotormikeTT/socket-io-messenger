import { List } from "@material-ui/core";
import MsgBubble from "./msgbubble";

const MsgBubbleList = (props) => {
  let messages = props.messages.map((message, idx) => {
    return <MsgBubble key={idx} message={message} />;
  });
  return <List>{messages}</List>;
};
export default MsgBubbleList;
