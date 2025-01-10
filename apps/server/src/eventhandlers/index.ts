import { Server, Socket } from "socket.io";
import { SocketStore } from "../socket/store";
import { handleIdentify } from "../eventhandlers/identify";
import { handleJoinChat } from "../eventhandlers/joinchat";
import { handleSendMessage } from "../eventhandlers/message-handler";
import { handleLeaveChat } from "../eventhandlers/leavechat";
import { handleDisconnect } from "../eventhandlers/disconnect";

export function registerEventHandlers(
  io: Server,
  socket: Socket,
  store: SocketStore
) {
  socket.on("identify", (userNumber) => handleIdentify(socket, store, userNumber));
  
  socket.on("joinChat", (data) => handleJoinChat(io, socket, store, data));
  
  socket.on("sendMessage", (data) => handleSendMessage(io, store, data));
  
  socket.on("leaveChat", (data) => handleLeaveChat(socket, store, data));
  
  socket.on("disconnect", () => handleDisconnect(socket, store));
}
