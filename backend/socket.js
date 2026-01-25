import { Server } from "socket.io";

let io;

// Allowed origins for Socket.io CORS
const getAllowedOrigins = () => [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean);

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: getAllowedOrigins(),
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
