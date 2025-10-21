import dotenv from "dotenv";
import http from "node:http"
import {app} from "./src/ticketApp.js"
import {Server }from "socket.io"
import express from "express"
dotenv.config({ path: "./.env" });

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin:"*",
    credentials:true
  }
   
})

// Apply middleware to all socket connections

// io.use(socketMiddlerWare)

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export {io}