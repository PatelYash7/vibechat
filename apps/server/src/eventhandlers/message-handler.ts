import { Server } from "socket.io";
import { SocketStore } from "../socket/store";

interface MessageData {
  roomId: string;
  message: string;
  senderNumber: string;
  senderName: string;
}

export function handleSendMessage(
  io: Server,
  store: SocketStore,
  data: MessageData
) {
  const { roomId, message, senderNumber, senderName } = data;

  if (!store.hasRoom(roomId)) {
    console.log(`Attempted to send message to non-existent room: ${roomId}`);
    return;
  }

  const room = store.getChatRoom(roomId)!;
  const receiverNumber = room.sender === senderNumber ? room.reciever : room.sender;
  const receiverSocketId = store.getUserSocket(receiverNumber);
  const senderSocketId = store.getUserSocket(senderNumber);
  const timestamp = new Date();

  // Send message to receiver
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
      message,
      senderNumber,
      senderName,
      timestamp,
      roomId
    });

    // Send notification
    io.to(receiverSocketId).emit("messageNotification", {
      senderName,
      senderNumber,
      message,
      timestamp,
      roomId
    });
  }

  // Update recent chats
  if (senderSocketId) {
    io.to(senderSocketId).emit("updateRecentChat", {
      userNumber: receiverNumber,
      message,
      timestamp,
      roomId
    });
  }

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("updateRecentChat", {
      userNumber: senderNumber,
      message,
      timestamp,
      roomId
    });
  }

  console.log(`Message sent in room ${roomId}: ${message}`);
}