import { Socket } from "socket.io";
import { SocketStore } from "../socket/store";
import { redisClients } from "../socket";

interface LeaveChatData {
  roomId: string;
  user: string;
}

export async function handleLeaveChat(
  socket: Socket,
  store: SocketStore,
  data: LeaveChatData
) {
  const { roomId, user } = data;
  const { client } = await redisClients();
  socket.leave(roomId);
  store.setChatRoom(roomId, { sender: "", reciever: "" });
  client.hSet(`chat:roomId:${roomId}`, {
    room: roomId,
    sender: "",
    reciever: "",
  });
  console.log(`${user} Left chat room: ${roomId}`);
}
