import { Socket } from "socket.io";

export const identify = ({
  userNumber,
  socket,
  userSockets,
}: {
  userNumber: string;
  socket: Socket;
  userSockets: Map<any, any>;
}) => {
  userSockets.set(userNumber, socket.id);
  console.log(`User ${userNumber} identified with socket ${socket.id}`);
};
