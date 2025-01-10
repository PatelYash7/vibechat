import express from "express";
import { Server } from "socket.io";

async function startServer() {
  try {
    const app = express();
    const server = app.listen(8080, () => {
      console.log("Express app running on PORT 8080");
    });
    
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false,
      },
    });

    const userSockets = new Map();
    const chatRooms = new Map();
  
    io.on("connection", (socket) => {
      socket.on("identify", (userNumber) => {
        userSockets.set(userNumber, socket.id);
        console.log(`User ${userNumber} identified with socket ${socket.id}`);
      });
      socket.on("joinChat", ({ sender, reciever }) => {
        const roomId = generateRoomId(sender,reciever ); 
        socket.join(roomId);
        chatRooms.set(roomId, { sender, reciever });
        console.log(`Created/Joined chat room: ${roomId}`);
        io.to(roomId).emit("chatReady", { roomId });
      });

      
      socket.on("sendMessage", ({ roomId, message, senderNumber, senderName,isCurrentChat }) => {
        if (chatRooms.has(roomId)) {
          const room = chatRooms.get(roomId);
          const receiverNumber = room.sender === senderNumber ? room.reciever : room.sender;
          const receiverSocketId = userSockets.get(receiverNumber);
          const senderSocketId = userSockets.get(senderNumber);
          // Emit message to both sender and receiver with full user info
          io.to(receiverSocketId).emit("newMessage", {
            message,
            senderNumber,
            senderName,
            timestamp: new Date(),
            roomId
          });


          // Send notification if receiver is not in the room
          if (receiverSocketId) {
            console.log("Message Sending")
            io.to(receiverSocketId).emit("messageNotification", {
              senderName,
              senderNumber,
              message,
              timestamp: new Date(),
              roomId
            });
          }

          // Emit recent chat update to both users
          if (senderSocketId) {
            io.to(senderSocketId).emit("updateRecentChat", {
              userNumber: receiverNumber,
              message,
              timestamp: new Date(),
              roomId
            });
          }
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("updateRecentChat", {
              userNumber: senderNumber,
              message,
              timestamp: new Date(),
              roomId
            });
          }

          
          console.log(`Message sent in room ${roomId}: ${message}`);
        } else {
          console.log(`Attempted to send message to non-existent room: ${roomId}`);
        }
      });

      socket.on("leaveChat", ({ roomId,user }) => {
        socket.leave(roomId);
        chatRooms.set(roomId,{reciever:''});
        console.log(chatRooms)
        console.log(`${user} Left chat room: ${roomId}`);
      });
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        for (let [userNumber, socketId] of userSockets.entries()) {
          if (socketId === socket.id) {
            userSockets.delete(userNumber);
            
            for (let [roomId, users] of chatRooms.entries()) {
              if (users.sender === userNumber || users.reciever === userNumber) {
                chatRooms.delete(roomId);
              }
            }
            break;
          }
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function generateRoomId(sender: string, reciever: string): string {
  return [sender, reciever].sort().join('_');
}

startServer();
