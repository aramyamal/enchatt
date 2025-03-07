import express from "express";
import { chatRouter } from "./router/chat";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { ChatService } from "./service/chat";


export const app = express();

const chatService = new ChatService();
export const httpServer = createServer(app);


app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/", chatRouter);


/**
 * the server-side socket which allows for a connection from the client side socket
 * 
 * @constant {Server} io - the socket connection instance
 * @param {string} cors.origin - allows requests from http://localhost:5173
 */
export const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:5173"
    }
});

// listens for new clients connecting to the server and assigns a unique socket ID
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);


    // listens for a 'joinChat' event
    socket.on("joinChat", async (chatId) => {
        try {

            // make sure the chat exists before allowing the user to join
            const chat = await chatService.getOrCreateChat(chatId);
            
            // just to make sure the getOrCreateChat call properly returned a chat
            if (chat) {
                // add the user to the chat room
                socket.join(chatId);
                // utputs a message to the console log when a user connects to the chat
                console.log(`User ${socket.id} joined chat ${chatId}`);
            } else {
                // emit to the client if a chat doesnt exist
                socket.emit("error", "Chat does not exist");
            }
        } catch (error) {
            console.error("Error joining chat:", error);
            socket.emit("error", "Failed to join chat");
        }
    });
    

    socket.on("sendMessage", async ({ chatId, sender, message, iv }) => {
        try {
            // store the message in the backend 

            // replace with DB!!!!!!
            const storedMessage = await chatService.sendMessage(chatId, sender, message, iv);
    
            // emit the stored message (now saved in the backend) to the users connected to the chat
            io.to(chatId).emit("receiveMessage", storedMessage);
        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", "Failed to send message");
        }
    });
    
});