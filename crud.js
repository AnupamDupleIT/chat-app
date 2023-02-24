const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/crud-api", { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("getUsers", () => {
    // code to retrieve users from database and emit them back to client
  });

  socket.on("createUser", (userData) => {
    // code to create a new user in the database and emit it back to client
  });

  socket.on("updateUser", (userData) => {
    // code to update an existing user in the database and emit it back to client
  });

  socket.on("deleteUser", (userId) => {
    // code to delete a user from the database and emit a confirmation back to client
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
