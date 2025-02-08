import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";
import { ChatService } from "./chat";
import crypto from "crypto";

let chatService: ChatService;
beforeEach(() => {
    chatService = new ChatService();
})

test("getting a Chat should return a deep copy of that chat", async () => {
    const testKey: string = crypto.randomBytes(crypto.randomInt(32)).toString("ascii");

    const newChat: Chat = await chatService.getOrCreateChat(testKey);
    const sameChat: Chat = await chatService.getOrCreateChat(testKey);
    expect(newChat).not.toBe(sameChat);
    expect(newChat).toEqual(sameChat);
})
