import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
declare global {
  var ioInitialized: boolean;
  var io: any;
}

let io: any;
if (!global.ioInitialized) {
  const app = express();
  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("message", (data) => {
      const { userId, message } = data;
      io.to(userId).emit("message", message);
    });
  });

  server.listen(4000, () => {
    console.log(`Server started on port 4000`);
  });
  global.ioInitialized = true;
} else {
  console.log(`Server is already listening on port 4000`);
  io = global.io;
}
global.io = io;
export default io;
