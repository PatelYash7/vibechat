import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { SocketStore } from "../socket/store";
import { registerEventHandlers } from "../eventhandlers/index";
import { createClient } from "redis";

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

export async function redisClients() {
  const pubClient = createClient();
  const subClient = pubClient.duplicate();
  const client = pubClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect(),client.connect()]);
  return { pubClient, subClient,client };
}
