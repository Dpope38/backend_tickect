"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_http_1 = __importDefault(require("node:http"));
const ticketApp_js_1 = require("./src/ticketApp.js");
const socket_io_1 = require("socket.io");
const socketManager_js_1 = require("./src/socket/socketManager.js");
const adminEvents_js_1 = require("./src/socket/events/adminEvents.js");
dotenv_1.default.config({ path: "./.env" });
const server = node_http_1.default.createServer(ticketApp_js_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});
(0, adminEvents_js_1.setIoInstance)(io);
(0, socketManager_js_1.registerSocketHandlers)(io);
// Apply middleware to all socket connections
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
