import { Server, Socket } from "socket.io";
import { SocketStore } from "../socket/store";
import { generateRoomId } from "../socket/store";
import { redisClients } from "../socket";

interface JoinChatData {
  sender: string;
  reciever: string;
}

export async function handleJoinChat(
  io: Server,
  socket: Socket,
  store: SocketStore,
  data: JoinChatData
) {
  const { sender, reciever } = data;
  const roomId = generateRoomId(sender, reciever);
  const { client } = await redisClients();
  socket.join(roomId);
  store.setChatRoom(roomId, { sender, reciever });
  const room = {
    "room":roomId,
    "sender": sender,
    "reciever": reciever,
  };
  await client.hSet(`chat:roomId:${roomId}`, room);
  client.expire(`chat:roomId:${roomId}`,60*60*24*7)
  io.to(roomId).emit("chatReady", { roomId });
}
