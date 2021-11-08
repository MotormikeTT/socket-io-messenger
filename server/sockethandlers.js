const moment = require("moment");
const matColours = require("./matdes100colours.json");
let names = [];
let rooms = [];

const handlegetAllRooms = (io) => {
  io.emit("getAllRooms", { rooms: rooms, clients: names });
};

const handleJoin = (socket, clientData) => {
  if (names.some((n) => n.chatName === clientData.chatName)) {
    socket.emit("nameexists", {
      text: `name already taken, try a different name`,
    });
  } else {
    let coloridx = Math.floor(Math.random() * matColours.colours.length) + 1;
    names.push({
      chatName: clientData.chatName,
      roomName: clientData.roomName,
      colour: matColours.colours[coloridx],
    });
    if (!rooms.some((r) => r === clientData.roomName)) {
      rooms.push(clientData.roomName);
    }
    socket.name = clientData.chatName;
    // use the room property to create a room
    socket.join(clientData.roomName);
    console.log(`${socket.name} has joined ${clientData.roomName}`);
    // send message to joining client
    socket.emit("welcome", {
      text: `welcome ${socket.name}`,
      from: "Admin",
      at: moment().format("h:mm:ss a"),
      room: clientData.roomName,
      colour: "#1C0221",
    });
    // send message to rest of the room the client just joined
    socket.to(clientData.roomName).emit("someonejoined", {
      text: `${socket.name} has joined the ${clientData.roomName} room!`,
      from: "Admin",
      at: moment().format("h:mm:ss a"),
      room: clientData.roomName,
      colour: "#1C0221",
    });
  }
};

const handleDisconnect = (socket) => {
  // send message to rest of the room the client just left
  let client = names.find((n) => n.chatName === socket.name);
  if (client != null) {
    socket.to(client.roomName).emit("someoneleft", {
      text: `${socket.name} has left room ${client.roomName}`,
      from: "Admin",
      at: moment().format("h:mm:ss a"),
      room: client.roomName,
      colour: "#1C0221",
    });
    names.splice(
      names.findIndex((n) => n.chatName === socket.name),
      1
    );
  }
};

const handleTyping = (socket, clientData) => {
  let client = names.find((n) => n.chatName === clientData.from);
  socket.to(client.roomName).emit("someoneistyping", {
    text: `${client.chatName} is typing`,
    from: client.chatName,
  });
};

const handleMessage = (socket, clientData) => {
  let client = names.find((n) => n.chatName === clientData.from);
  // emit new message to everyone in the room
  socket.to(client.roomName).emit("newmessage", {
    text: clientData.text,
    from: client.chatName,
    at: moment().format("h:mm:ss a"),
    colour: client.colour,
    room: client.roomName,
    isMe: false,
  });
  // emit new message to the sender
  socket.emit("newmessage", {
    text: clientData.text,
    from: client.chatName,
    at: moment().format("h:mm:ss a"),
    colour: client.colour,
    room: client.roomName,
    isMe: true,
  });
};

module.exports = {
  handleJoin,
  handleDisconnect,
  handleTyping,
  handleMessage,
  handlegetAllRooms,
};
