import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";
import { ChatService } from "./chat";
import crypto from "crypto";

let chatService: ChatService;
let testKey: string;
beforeEach(() => {
    chatService = new ChatService();
    testKey = crypto.randomBytes(crypto.randomInt(32) + 1).toString("ascii");
})

// possibly split this into "getting a Chat should return distinct but equal
// copy" and "modifying a Chat copy should not affect the original", but both 
// are needed to test if getting a chat returns a deep copy, hence the 
// combination of them here:
test("getting a Chat should return a deep copy of that chat", async () => {
    const newChat: Chat = await chatService.getOrCreateChat(testKey); // create
    const sameChat: Chat = await chatService.getOrCreateChat(testKey); // get

    // ensure initial retrieved chats with same keys are distinct but equal
    expect(newChat).not.toBe(sameChat);
    expect(newChat).toEqual(sameChat);

    // modify the first copy
    newChat.messages.push({
        sender: "testSender",
        time: 0,
        content: "test message."
    })

    // retrieve the chat a third time
    const thirdChat = await chatService.getOrCreateChat(testKey);

    // verify that the stored chat is not affected by the modificiation
    expect(thirdChat.messages).toEqual([]);
    expect(thirdChat).toEqual(sameChat);
})

test("creating a Chat should return a deep copy of that chat", async () => {
    const newChat: Chat = await chatService.getOrCreateChat(testKey);

    // modify the newly created chat
    newChat.messages.push({
        sender: "testSender",
        time: 0,
        content: "test message."
    })

    // retrieve the chat with key again
    const retrievedChat = await chatService.getOrCreateChat(testKey);

    // check that the modificiation is not present in the retrieved chat
    expect(retrievedChat.messages).toEqual([]);
    expect(retrievedChat.messages).toHaveLength(0);
})

test("sending a message to a Chat should create a Message and add it to the "
    + "corresponding Chat", async () => {
        const testKey: string = crypto.randomBytes(crypto.randomInt(32))
            .toString("ascii");

        chatService.getOrCreateChat(testKey);
        let message: Message = await chatService
            .sendMessage(testKey, "sender", "test content.");

        expect((await chatService.getOrCreateChat(testKey)).messages)
            .toContainEqual(message);
    }
)

test("sending a message to an uninitialized chat should throw an error",
    async () => {
        await expect(chatService.sendMessage(testKey, "sender", "test content"))
            .rejects
            .toThrow();
    }
)

test("sending an empty message should throw an error", async () => {
    await chatService.getOrCreateChat(testKey);

    await expect(chatService.sendMessage(testKey, "sender", ""))
        .rejects
        .toThrow();
})

test("sending a message with only whitespace should throw error", async () => {
    await chatService.getOrCreateChat(testKey);

    await expect(chatService.sendMessage(testKey, "sender", "    \t   \n \n  "))
        .rejects
        .toThrow();
})
