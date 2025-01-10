import { Socket } from "socket.io";
import { SocketStore } from "../socket/store";

export function handleIdentify(
  socket: Socket,
  store: SocketStore,
  userNumber: string
) {
  store.setUserSocket(userNumber, socket.id);
  console.log(`User ${userNumber} identified with socket ${socket.id}`);
}