import express, { Request, Response } from "express";
import { ChatService } from "../service/chat";
import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";
import { HttpError } from "../errors/HttpError";

const chatService = new ChatService();

export const chatRouter = express.Router();

chatRouter.get("/chat/:key", async (
    req: Request<{ key: string }>,
    res: Response<Chat | string>
) => {
    try {
        const { key } = req.params;
        const chat: Chat = await chatService.getOrCreateChat(key);
        res.status(200).send(chat);
    } catch (e: any) {
        if (e instanceof HttpError) {
            res.status(e.statusCode).send(e.message);
        } else if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Unknown error occurred");
        }
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
        const message: Promise<Message> = chatService.sendMessage(key, sender, content);
        res.status(201).send(await message);
    } catch (e: any) {
        if (e instanceof HttpError) {
            res.status(e.statusCode).send(e.message);
        } else if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Unknown error occurred");
        }
    }
}
);
