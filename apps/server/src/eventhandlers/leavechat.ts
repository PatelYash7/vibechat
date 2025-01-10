import { Socket } from "socket.io";
import { SocketStore } from "../socket/store";

interface LeaveChatData {
  roomId: string;
  user: string;
}

export function handleLeaveChat(
  socket: Socket,
  store: SocketStore,
  data: LeaveChatData
) {
  const { roomId, user } = data;
  
  socket.leave(roomId);
  store.setChatRoom(roomId, { sender: '', reciever: '' });
  
  console.log(`${user} Left chat room: ${roomId}`);
}
