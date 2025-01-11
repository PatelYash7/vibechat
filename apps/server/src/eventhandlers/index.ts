import { Server, Socket } from "socket.io";
import { SocketStore } from "../socket/store";
import { handleIdentify } from "../eventhandlers/identify";
import { handleJoinChat } from "../eventhandlers/joinchat";
import { handleSendMessage } from "../eventhandlers/message-handler";
import { handleLeaveChat } from "../eventhandlers/leavechat";
import { handleDisconnect } from "../eventhandlers/disconnect";
import { redisClients } from "../socket";
export async function registerEventHandlers(
  io: Server,
  socket: Socket,
  store: SocketStore
) {
  socket.on("identify", (userNumber) =>
    handleIdentify(socket, store, userNumber)
  );

  socket.on("joinChat", (data) => handleJoinChat(io, socket, store, data));

  socket.on("sendOldMessage", (data) => handleOldMessage(io, data));
  socket.on("sendMessage", (data) => handleSendMessage(io, store, data));

  socket.on("leaveChat", (data) => handleLeaveChat(socket, store, data));

  socket.on("disconnect", () => handleDisconnect(socket, store));
}
export async function handleOldMessage(
  io: Server,
  data: {
    roomId: string;
    sender: string;
  }
) {
  const { client } = await redisClients();
  const sendersocketId = await client.get(data.sender) 
  const key = `chat:message:${String(data.roomId)}`;
  const response = await client.lRange(key, 0, -1);
  const oldMessage = response.map((item) => JSON.parse(item));
  console.log(sendersocketId)
  if (oldMessage && sendersocketId) {
    io.to(sendersocketId).emit("oldMessage", oldMessage);
  }
  console.log("In Old Message");
}
