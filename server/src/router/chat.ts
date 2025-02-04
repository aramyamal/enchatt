import express, { Request, Response } from "express";
import { ChatService } from "../service/chatService";
import { Chat } from "../model/chat.interface";

const chatService = new ChatService();

export const chatRouter = express.Router();

chatRouter.get("/chat/:key", async (
    req: Request<{ key: string }>,
    res: Response<Chat>
) => {
    try {
        const { key } = req.params;
        let chat = await chatService.createOrGetChat(key);
        res.status(200).send(chat);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});



