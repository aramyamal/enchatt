import { Server } from "socket.io";
import { chatsDbService } from "./service/chatsDbService";
import { IChatService } from "./service/IChatService";

/**
 * init of a chatService to handle chat persistance
 * 
 * @const {IChatService} chatService - a chatDbService instance that saves messages to chats in the database
 */
const chatService: IChatService = new chatsDbService();


/**
 * init of the server-side socket which allows for a connection from the client side socket
 * 
 * @param {any} httpServer - the HTTP server to attach the socket to
 * @return {Server} io - the socket connection instance
 */
export const initializeSocket = (httpServer: any) => {
    const io = new Server(httpServer, { 
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

// listens for new clients connecting to the server and assigns a unique socket ID
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);


    /**
     * handles users joining a chat room
     * 
     * @event joinChat
     * @param {string} chatId - The id of the chat the user wants to join
     */
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
            // error log in the console and emit failed to join chat
            console.error("Error joining chat:", error);
            socket.emit("error", "Failed to join chat");
        }
    });
    

    /**
     * handles sending messages in a chat
     * 
     * @event sendMessage
     * @param {Object} data - message details.
     * @param {string} data.chatId - the id of the chat
     * @param {string} data.sender - the username or sender id
     * @param {string} data.message - the message content
     * @param {string} data.iv - initialization vector for encryption
     */
    socket.on("sendMessage", async ({ chatId, sender, message, iv }) => {
        try {
            // store the message in the backend
            const storedMessage = await chatService.sendMessage(chatId, sender, message, iv);
            // emit the stored message (now saved in the backend) to the users connected to the chat
            io.to(chatId).emit("receiveMessage", storedMessage);
            console.log(`Sent message to ${chatId}, with content ${storedMessage}`);
        } catch (error) {
            // log the error and emit that message failed to send
            console.error("Error sending message:", error);
            socket.emit("error", "Failed to send message");
        }
    });
    
});

    return io;
};
