import { Typography } from "@material-ui/core";
import "../App.css";

const Bubble = (props) => {
  let msg = props.message;
  return (
    <div className="userBubble" style={{ backgroundColor: msg.colour }}>
      <Typography component={"span"} style={{ fontSize: 12 }}>
        {msg.from} says:
        <div style={{ float: "right" }}>
          room: {msg.room}
          <br />@{msg.at}
        </div>
      </Typography>
      <Typography style={{ marginTop: 20 }}>{msg.text}</Typography>
    </div>
  );
};
export default Bubble;
