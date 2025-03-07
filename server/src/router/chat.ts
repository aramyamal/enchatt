import express, { Request, Response } from "express";
import { ChatService } from "../service/chat";
import { Chat, CombinedChat } from "../model/chat.interface";
import { Message } from "../model/message.interface";
import { HttpError } from "../errors/HttpError";

const chatService = new ChatService();

export const chatRouter = express.Router();

chatRouter.get("/chat/:key", async (
    req: Request<{ key: string }>,
    res: Response<{ messages: Message[], ivs: string } | { error: string }>
) => {
    try {
        const { key } = req.params;
        const chat: Chat = await chatService.getOrCreateChat(key);

        // Ensure we send IVs along with messages
        res.status(200).json({ messages: chat.messages, ivs: chat.salt });
    } catch (e: any) {
        if (e instanceof HttpError) {
            res.status(e.statusCode).json({ error: e.message });
        } else {
            res.status(500).json({ error: "Unknown error occurred" });
        }
    }
});


chatRouter.post("/chat/:key", async (
    req: Request<{ key: string }, {}, { sender: string, content: string, iv: string }>,
    res: Response<Message | string>
) => {
    try {
        const { key } = req.params;
        const sender: string = req.body.sender;
        const content: string = req.body.content;
        const iv: string = req.body.iv;
        const message: Promise<Message> = chatService.sendMessage(key, sender, content, iv);
        res.status(201).send(await message);
        return;
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

chatRouter.get("/chats", async (
    req: Request<{}, {}, {}, {
        key1?: string,
        key2?: string,
        key3?: string,
        key4?: string
    }>,
    res: Response<CombinedChat | string>
) => {
    try {
        const { key1, key2, key3, key4 } = req.query;
        // if (!key1 || !key2) {
        //     res.status(400).send("Missing key1 or key2.");
        // }
        if (!key1 && !key2 && !key3 && !key4) {
            res.status(400).send("At least one key must be provided.");
            return;
        }

        const combinedChat: CombinedChat= await chatService.getOrCreateMultipleChats(
            key1 as string, 
            key2 as string,
            key3 as string, 
            key4 as string
        );

        res.status(202).send(combinedChat);

    }
    catch (e: any) {
        if (e instanceof HttpError) {
            res.status(e.statusCode).send(e.message);
        } else if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Unknown error occurred");
        }
    }
});
