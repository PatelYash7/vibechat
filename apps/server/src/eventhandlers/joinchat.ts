import { Server, Socket } from "socket.io";
import { SocketStore } from "../socket/store";
import { generateRoomId } from "../socket/store";

interface JoinChatData {
  sender: string;
  reciever: string;
}

export function handleJoinChat(
  io: Server,
  socket: Socket,
  store: SocketStore,
  data: JoinChatData
) {
  const { sender, reciever } = data;
  const roomId = generateRoomId(sender, reciever);
  
  socket.join(roomId);
  store.setChatRoom(roomId, { sender, reciever });
  
  console.log(`Created/Joined chat room: ${roomId}`);
  io.to(roomId).emit("chatReady", { roomId });
}