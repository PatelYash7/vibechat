import { Socket } from "socket.io";
import { SocketStore } from "../socket/store";
import { redisClients } from "../socket";

export async function handleDisconnect(socket: Socket, store: SocketStore) {
  console.log(`Client disconnected: ${socket.id}`);
  const {client}=await redisClients();
  for (let [userNumber, socketId] of store.getUserSockets()) {
    if (socketId === socket.id) {
      store.removeUserSocket(userNumber);
      await client.del(userNumber)
      const rooms = store.getUserRooms(userNumber);
      rooms.forEach(roomId => {store.removeChatRoom(roomId)}
    );
      break;
    }
  }
}