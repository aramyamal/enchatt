import express, { Request, Response } from "express";
import { Chat } from "../model/chat.interface";
import { Message } from "../model/message.interface";
import { HttpError } from "../errors/HttpError";
import { IChatService  } from "../service/IChatService";
import { chatsDbService } from "../service/chatsDbService";

const chatService: IChatService = new chatsDbService();

export const chatRouter = express.Router();

chatRouter.get("/chat/:key", async (
    req: Request<{ key: string }>,
    res: Response<Chat | string>
) => {
    try {
        const { key } = req.params;
        const chat = await chatService.getOrCreateChat(key);
        res.status(200).send(JSON.stringify(chat));
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

chatRouter.post("/chat/:key", async (
    req: Request<{ key: string }, {}, { sender: string, content: string }>,
    res: Response<Message | string>
) => {
    try {
        const { key } = req.params;
        const sender: string = req.body.sender;
        const content: string = req.body.content;
        const message = await chatService.sendMessage(key, sender, content);
        res.status(201).json(message);
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
    res: Response<Chat | string>
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

        const combinedChat = await chatService.getOrCreateMultipleChats(
            key1 as string, 
            key2 as string,
            key3 as string, 
            key4 as string
        );

        res.status(202).json(combinedChat);
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
