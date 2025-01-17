import { Server } from "socket.io";
import { SocketStore } from "../socket/store";
import { redisClients } from "../socket";

interface MessageData {
  roomId: string;
  message: string;
  senderNumber: string;
  senderName: string;
}

export async function handleSendMessage(
  io: Server,
  store: SocketStore,
  data: MessageData
) {
  const { roomId, message, senderNumber, senderName } = data;
  const {client}=await redisClients();
  if (!store.hasRoom(roomId)) {
    console.log(`Attempted to send message to non-existent room: ${roomId}`);
    return;
  }

  const redRoom = await client.hGetAll(`chat:roomId:${roomId}`);
  const receiverNumberRedis = redRoom.sender===senderNumber?redRoom.reciever:redRoom.sender;
  const receiverSocketIdRedis=await client.get(receiverNumberRedis);
  const senderSocketIdRedis= await client.get(senderNumber)
  const timestamp = new Date();

  // Send message to receiver
  if ( receiverSocketIdRedis) {
    const key = `chat:message:${String(redRoom.room)}`;
    io.to(receiverSocketIdRedis).emit("newMessage", {
      message,
      senderNumber,
      senderName,
      timestamp,
      roomId
    });
    const packet={
      content:message,
      sender:senderNumber,
    }
    await client.rPush(key, JSON.stringify(packet));
    
    // Send notification
    io.to(receiverSocketIdRedis).emit("messageNotification", {
      senderName,
      senderNumber,
      message,
      timestamp,
      roomId
    });
  }

  // Update recent chats
  if (senderSocketIdRedis) {
    io.to(senderSocketIdRedis).emit("updateRecentChat", {
      userNumber: receiverNumberRedis,
      message,
      timestamp,
      roomId
    });
  }

  if (receiverSocketIdRedis) {
    io.to(receiverSocketIdRedis).emit("updateRecentChat", {
      userNumber: senderNumber,
      message,
      timestamp,
      roomId
    });
  }

  console.log(`Message sent in room ${roomId}: ${message}`);
}