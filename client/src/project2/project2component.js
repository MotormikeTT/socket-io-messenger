import { useReducer, useEffect } from "react";
import io from "socket.io-client";
import { MuiThemeProvider } from "@material-ui/core/styles";
import AccountBox from "@material-ui/icons/AccountBox";
import {
  Button,
  Card,
  RadioGroup,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";

import theme from "../theme";
import logo from "../assets/logo.png";
import "../App.css";
import MsgBubbleList from "./msgbubblelist";
import TopBar from "./topbar";

const Project2Component = () => {
  const initialState = {
    messages: [],
    rooms: [],
    clients: [],
    status: "",
    showjoinfields: true,
    alreadyexists: false,
    chatName: "",
    roomName: "",
    typingMsg: "",
    isTyping: false,
    message: "",
    open: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDialog = () => setState({ open: !state.open });

  const serverConnect = () => {
    // connect to server
    const socket = io.connect("localhost:5000", { forceNew: true });
    //const socket = io.connect();
    socket.on("getAllRooms", getRooms);
    socket.on("nameexists", onExists);
    socket.on("welcome", addMessage);
    socket.on("someonejoined", addMessage);
    socket.on("someoneleft", addMessage);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    setState({ socket: socket });
  };

  const getRooms = (dataFromServer) => {
    setState({ rooms: dataFromServer.rooms, clients: dataFromServer.clients });
  };

  const onExists = (dataFromServer) => {
    setState({ status: dataFromServer.text });
  };

  const onTyping = (dataFromServer) => {
    if (dataFromServer.from !== state.chatName) {
      setState({
        typingMsg: dataFromServer.text,
      });
    }
  };

  const onNewMessage = (dataFromServer) => {
    addMessage(dataFromServer);
    setState({ typingMsg: "", message: "" });
  };

  // generic handler for all other messages:
  const addMessage = (dataFromServer) => {
    let messages = state.messages;
    messages.push(dataFromServer);
    setState({
      messages: messages,
      users: dataFromServer.users,
      showjoinfields: false,
      alreadyexists: false,
    });
  };

  // handler for join button click
  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };

  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.chatName }, (err) => {});
      setState({ isTyping: true }); // flag first byte only
    }
  };

  // handler for name TextField entry
  const onNameChange = (e) => {
    setState({ chatName: e.target.value, status: "" });
  };

  // handler for room TextField entry
  const onRoomChange = (e) => {
    setState({ roomName: e.target.value });
  };

  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { from: state.chatName, text: state.message },
        (err) => {}
      );
      setState({ isTyping: false });
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card>
        <TopBar viewDialog={handleDialog} showIcon={state.showjoinfields} />
        {state.showjoinfields && (
          <div>
            <img
              src={logo}
              alt="logo"
              title="Chat it Up! logo"
              width="20%"
              style={{
                paddingLeft: "40%",
                marginTop: 20,
              }}
            />
            <h3 style={{ textAlign: "center" }}>Sign In</h3>

            <div
              style={{
                border: "solid",
                borderColor: "lightgrey",
                borderWidth: 1,
                borderRadius: 2,
                padding: "3vw",
                margin: "3vw",
              }}
            >
              <TextField
                onChange={onNameChange}
                placeholder="Chat Name"
                autoFocus={true}
                required
                value={state.chatName}
                error={state.status !== ""}
                helperText={state.status}
              />
            </div>
            <p></p>
            <div
              style={{
                border: "solid",
                borderColor: "lightgrey",
                borderRadius: 2,
                borderWidth: 1,
                padding: "3vw",
                margin: "3vw",
              }}
            >
              <Typography color="primary">
                Join Existing or Enter Room Name
              </Typography>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <RadioGroup
                  name="roomchoice"
                  value={state.roomName}
                  onChange={onRoomChange}
                >
                  {state.rooms.map((room, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={room}
                      control={<Radio />}
                      label={room}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <TextField
                onChange={onRoomChange}
                placeholder="Enter room name"
                required
                value={state.roomName}
              />
            </div>
            <p></p>
            <Button
              variant="contained"
              data-testid="submit"
              color="primary"
              style={{ marginLeft: "3%" }}
              onClick={() => handleJoin()}
              disabled={state.chatName === "" || state.roomName === ""}
            >
              Join
            </Button>
          </div>
        )}
        {!state.showjoinfields && (
          <div>
            {state.messages && <MsgBubbleList messages={state.messages} />}
            <TextField
              onChange={onMessageChange}
              placeholder="type something here"
              autoFocus={true}
              value={state.message}
              onKeyPress={(e) =>
                e.key === "Enter" ? handleSendMessage() : null
              }
              style={{ margin: 5, width: "97%" }}
            />
            <Typography color="primary">{state.typingMsg}</Typography>
          </div>
        )}
      </Card>
      <Dialog open={state.open} onClose={handleDialog} style={{ margin: 20 }}>
        <DialogTitle style={{ textAlign: "center" }}>Who's On?</DialogTitle>
        <DialogContent>
          {state.clients &&
            state.clients.map((c) => (
              <Typography key={c.chatName} style={{ marginBottom: 10 }}>
                <AccountBox
                  style={{
                    marginBottom: -6,
                    paddingRight: 20,
                    color: c.colour,
                  }}
                />{" "}
                {c.chatName} is in room {c.roomName}
              </Typography>
            ))}
        </DialogContent>
      </Dialog>
    </MuiThemeProvider>
  );
};

export default Project2Component;
