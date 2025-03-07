import express from "express";
import { chatRouter } from "./router/chat";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

export const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/", chatRouter);

export const httpServer = createServer(app);

export const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
