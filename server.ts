import dotenv from "dotenv";
import http from "node:http"
import {app} from "./src/ticketApp.js"
import {Server }from "socket.io"
import { registerSocketHandlers } from "./src/socket/socketManager.js";
import {setIoInstance} from "./src/socket/events/adminEvents.js"
dotenv.config({ path: "./.env" });

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials:true
  }
   
})

  
const HOST:string = process.env.HOST || 'localhost';
setIoInstance(io);

registerSocketHandlers(io);

// Apply middleware to all socket connections


const PORT = process.env.PORT;

// server.listen(PORT,  () => {
//   console.log(`Server is running on port ${PORT}`);
// });
 let serverHandle = server.listen(PORT, HOST, () => {
  console.log('=================================');
  console.log(`🚀 Server started successfully`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${HOST}:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log('=================================');
});
console.log('more about the server', serverHandle);
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal, closing server...');
  
  serverHandle.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);