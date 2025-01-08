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
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allowed HTTP methods
        credentials: false, // Disable credentials (cookies, authorization headers, etc.)
      },
    });

    const userSockets =new Map();


    io.on("connection", (socket) => {
      console.log(`New Client connected: ${socket.id}`)

      socket.on("identify",(userNumber)=>{
        userSockets.set(userNumber,socket.id)
        console.log(`User ${userNumber} identified with socket ${socket.id}`);
      })
      // Message Handling
      socket.on("sendMessageToUser",({receiverUserNumber,message})=>{
        const receiverSocketId = userSockets.get(receiverUserNumber);
        if(receiverSocketId){
          io.to(receiverSocketId).emit("privateMessage",{message,});
          console.log(`Message sent to user ${receiverSocketId}: ${message}`);
        }else{
          console.log(`User ${receiverSocketId} not connected`);
        }
      })
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        for (let [userNumber, socketId] of userSockets.entries()) {
          if (socketId === socket.id) {
            userSockets.delete(userNumber);
            break;
          }
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();
