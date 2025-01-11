import { Socket } from "socket.io";
import { SocketStore } from "../socket/store";
import { redisClients } from "../socket";

export async function handleIdentify(
  socket: Socket,
  store: SocketStore,
  userNumber: string,
) {
  const {client}= await redisClients();
  await client.set(userNumber,socket.id);
  console.log(`User ${userNumber} identified with socket ${socket.id}`);
}