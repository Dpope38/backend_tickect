import dotenv from "dotenv";
import http from "node:http"
import {app} from "./src/ticketApp.js"
import {Server }from "socket.io"
import { registerSocketHandlers } from "./src/socket/socketManager.js";
import {setIoInstance} from "./src/socket/events/adminEvents.js"
import express from "express"
dotenv.config({ path: "./.env" });

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials:true
  }
   
})

  

setIoInstance(io);

registerSocketHandlers(io);

// Apply middleware to all socket connections


const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
