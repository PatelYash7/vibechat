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
    io.on("connection", (socket) => {
      console.log(socket.id);
      socket.on("customEvent", (data) => {
        console.log(`Received customEvent from client: ${data.message}`);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();
