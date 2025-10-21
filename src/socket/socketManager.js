export const registerSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);
        
        // Handle joining a room
        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
}