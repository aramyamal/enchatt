import crypto from "crypto";
import { IChatService } from "./IChatService";
import { chatsDbService } from "./chatsDbService";
import { ChatsModel } from "../../db/chats.db";
import { sequelize } from "../../db/conn";
import { messagesModel } from "../../db/messages.db";

let chatService: IChatService;
let testKey: string;
let testIv: string

beforeAll(async () => {
    // ensure a fresh database before all tests
    await sequelize.sync({ force: true }); 
});

beforeEach(async () => {
    chatService = new chatsDbService();

    // testKey and testIv needs to be a fixed length and not ascii for db queries
    testKey = crypto.randomBytes(16).toString("hex");
    testIv = crypto.randomBytes(12).toString("hex");

    // ensure chat exists before tests
    await chatService.getOrCreateChat(testKey);
});

afterEach(async () => {
    // clear tables between tests
    await messagesModel.destroy({ where: {} });
    await ChatsModel.destroy({ where: {} });
});

test("sending a message to a chat should create a MessageModel and add it to the corresponding ChatModel", async () => {
    let message: messagesModel = await chatService
        .sendMessage(testKey, "sender", "test content.", testIv);

    
    expect(await chatService.getMessages(testKey).then(messages => messages.map(m => m.toJSON())))
        .toContainEqual(message.toJSON());
    
});

test("sending a message to an uninitialized chat should throw an error", async () => {
    const newKey = crypto.randomBytes(16).toString("hex"); // Ensure a new chat key

    await expect(chatService.sendMessage(newKey, "sender", "test content", testIv))
        .rejects
        .toThrow();
});

test("sending an empty message should throw an error", async () => {
    await expect(chatService.sendMessage(testKey, "sender", "", testIv))
        .rejects
        .toThrow();
});

test("sending a message with only whitespace should throw an error", async () => {
    await expect(chatService.sendMessage(testKey, "sender", "    \t   \n \n  ", testIv))
        .rejects
        .toThrow();
});
