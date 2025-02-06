import express, { Request, Response } from "express";
import { ChatService } from "../service/chat";
import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";

const chatService = new ChatService();

export const chatRouter = express.Router();

chatRouter.get("/chat/:key", async (
    req: Request<{ key: string }>,
    res: Response<Chat | string>
) => {
    try {
        const { key } = req.params;
        let chat = await chatService.createOrGetChat(key);
        res.status(200).send(chat);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

chatRouter.post("/chat/", async (
    req: Request<{}, {}, { key: string, sender: string, content: string }>,
    res: Response<Message | string>
) => {
    try {
        const key: string = req.body.key;
        const sender: string = req.body.sender;
        const content: string = req.body.content;
        const message: Message = await chatService.sendMessage(key, sender, content);
        res.status(201).send(message);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
}
);
