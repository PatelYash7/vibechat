import express from "express";
import { createServer } from "http";
import { initializeSocketServer } from "./socket/index";
import * as dotenv from 'dotenv';

async function startServer() {
  try {
    const app = express();
    const server = createServer(app);
    
    // Initialize Socket.io server
    initializeSocketServer(server);
    
    server.listen(8080, () => {
      console.log("Express app running on PORT 8080");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();