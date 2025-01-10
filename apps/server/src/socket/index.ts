import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { SocketStore } from "../socket/store";
import { registerEventHandlers } from "../eventhandlers/index";

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const socketStore = new SocketStore();
  
  io.on("connection", (socket) => {
    registerEventHandlers(io, socket, socketStore);
  });

  return io;
}
