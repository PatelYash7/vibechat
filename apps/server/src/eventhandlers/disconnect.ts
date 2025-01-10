import { Socket } from "socket.io";
import { SocketStore } from "../socket/store";

export function handleDisconnect(socket: Socket, store: SocketStore) {
  console.log(`Client disconnected: ${socket.id}`);

  for (let [userNumber, socketId] of store.getUserSockets()) {
    if (socketId === socket.id) {
      store.removeUserSocket(userNumber);
      
      const rooms = store.getUserRooms(userNumber);
      rooms.forEach(roomId => store.removeChatRoom(roomId));
      
      break;
    }
  }
}