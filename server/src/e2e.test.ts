import * as SuperTest from "supertest";
import crypto from "crypto";
import { IChatService } from "./service/IChatService";
import { sequelize } from "../db/conn";
import { chatsDbService } from "./service/chatsDbService";
import { io as Client, Socket } from "socket.io-client";
import { httpServer } from "./start";
import { messagesModel } from "../db/messages.db";
import { ChatsModel } from "../db/chats.db";

let chatService: IChatService;
let testKey1: string;
let testIv1: string;
let testKey2: string;
let testIv2: string;
let testIv3: string;
const testUser = "browser_user";
const testContent = "test_content";
let clientSocket: Socket;
const PORT = 8888;
const request = SuperTest.default(httpServer.listen(PORT));

beforeAll(async () => {

    // ensure a fresh database before all tests
    await sequelize.sync({ force: true });

    // initialize test data
    chatService = new chatsDbService();
    testKey1 = crypto.randomBytes(16).toString("hex");
    testIv1 = crypto.randomBytes(12).toString("hex");
    testKey2 = crypto.randomBytes(16).toString("hex");
    testIv2 = crypto.randomBytes(12).toString("hex");
    testIv3 = crypto.randomBytes(12).toString("hex");

    // Ensure chat for testKey1 exists before tests
    await chatService.getOrCreateChat(testKey1);
    await chatService.sendMessage(
        testKey1,
        testUser,
        testContent,
        testIv1
    );
});

describe("End to end test", () => {

    // establich socket connections
    clientSocket = Client(`http://localhost:${PORT}`, {
        withCredentials: true,
    });
    clientSocket.on("connect", () => {
        console.log("Socket connected with id:", clientSocket.id);
    });

    it("Should have established a WebSocket connection on startup", () => {
        expect(clientSocket.connected).toBe(true);
    });

    it("Should retrieve and create chats through api", async () => {
        const getRes = await request.get(
            `/chats?key1=${testKey1}&key2=${testKey2}&key3=&key4=`
        );
        expect(getRes.status).toBe(202);
        expect(getRes.body).toHaveProperty("messages");
        expect(getRes.body).toHaveProperty("salts");

        // check that previous chat is loaded
        expect(getRes.body.messages[0].chatKey).toEqual(testKey1);
        expect(getRes.body.messages[0].sender).toEqual(testUser);
        expect(getRes.body.messages[0].content).toEqual(testContent);
        expect(getRes.body.messages[0].iv).toEqual(testIv1);

        // check that new chat is created and in correct order
        expect(getRes.body.salts[1]).not.toBeUndefined();
        expect(() => {chatService.getMessages(testKey2);}).not.toThrow();
    });

    it("Should get new messages through socket from client", async () => {
        // send message through socket
        clientSocket.emit("sendMessage", {
            chatId: testKey2,
            sender: "browser_user2",
            message: "test content 2",
            iv: testIv2
        });

        // wait for backend to have processed socket request
        await new Promise(resolve => setTimeout(resolve, 500));

        // fetch new messages through api
        const getRes = await request.get(
            `/chats?key1=${testKey1}&key2=${testKey2}&key3=&key4=`
        );
        expect(getRes.status).toBe(202);
        expect(getRes.body).toHaveProperty("messages");
        expect(getRes.body).toHaveProperty("salts");

        // check that previous chat is still there
        expect(getRes.body.messages[0].chatKey).toEqual(testKey1);
        expect(getRes.body.messages[0].sender).toEqual(testUser);
        expect(getRes.body.messages[0].content).toEqual(testContent);
        expect(getRes.body.messages[0].iv).toEqual(testIv1);

        // check that emitted message through socket is created
        expect(getRes.body.messages[1].chatKey).toEqual(testKey2);
        expect(getRes.body.messages[1].sender).toEqual("browser_user2");
        expect(getRes.body.messages[1].content).toEqual("test content 2");
        expect(getRes.body.messages[1].iv).toEqual(testIv2);
    })

    it("should emit back messages to the correct room when a new message is sent to it", async () => {
        // join chat room 2
        clientSocket.emit("joinChat", testKey2);

        // wait for the client to join the chat room
        await new Promise(resolve => setTimeout(resolve, 500));

        // listen for the 'receiveMessage' event on the client socket
        const messagePromise = new Promise((resolve) => {
            clientSocket.on("receiveMessage", (message: messagesModel) => {
                resolve(message);
            });
        });

        // send a message to the chat room
        const testMessage = {
            chatId: testKey2,
            sender: testUser,
            message: "test content 3",
            iv: testIv3
        };
        clientSocket.emit("sendMessage", testMessage);

        // construct expected message back
        const exptectedMessage = {
            chatKey: testMessage.chatId,
            sender: testMessage.sender,
            content: testMessage.message,
            iv: testMessage.iv
        }

        // wait for the 'receiveMessage' event to be emitted
        const receivedMessage: any = await messagePromise;
        
        // verify that the received message matches the sent message
        expect(receivedMessage).toMatchObject(exptectedMessage);

        // verify that the message was stored in the database
        const getRes = await request.get(
            `/chats?key1=${testKey1}&key2=${testKey2}&key3=&key4=`
        );
        expect(getRes.status).toBe(202);
        expect(getRes.body).toHaveProperty("messages");
        expect(getRes.body).toHaveProperty("salts");
        expect(getRes.body.messages[2]).toMatchObject(exptectedMessage);
        expect(getRes.body.salts[3]).not.toBeUndefined();
        expect(getRes.body.salts[4]).toBeUndefined();
    });

    it("Should disconnect socket when user is finished", () => {
        expect(clientSocket.connected).toBe(true); // Should still be connected
        clientSocket.disconnect(); // Explicitly disconnect
        expect(clientSocket.connected).toBe(false); // Now check if disconnected
    });

});

// clean up after all tests
afterAll(async () => {
    // close socket connection properly
    if (clientSocket) {
        clientSocket.disconnect();
    }

    // close server with promise handling
    await new Promise<void>((resolve) => {
        httpServer.close(() => {
            console.log("HTTP server closed");
            resolve();
        });
    });

    // clear tables between tests
    await messagesModel.destroy({ where: {} });
    await ChatsModel.destroy({ where: {} });

    // close database connection
    await sequelize.close();

    console.log("Test cleanup complete");
});
