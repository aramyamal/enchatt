import express, { Request, Response } from "express";
import { HttpError } from "../errors/HttpError";
import { IChatService  } from "../service/IChatService";
import { chatsDbService } from "../service/chatsDbService";
import { messagesModel } from "../../db/messages.db";

const chatService: IChatService = new chatsDbService();

export const chatRouter = express.Router();

/**
 * @route GET /chat/:key
 * retrieves chat messages for a given key, or creates a new chat if it does not exist
 * 
 * @param {Request<{ key: string }>} req - express request object with a chat key as a URL parameter
 * @param {Response<{ messages: messagesModel[], ivs: string } | { error: string }>} res - response containing messages and an iv, or an error
 * @returns {Promise<void>} - JSON response with chat messages and iv or an error message
 */
chatRouter.get("/chat/:key", async (
    req: Request<{ key: string }>,
    res: Response<{ messages: messagesModel[], ivs: string } | { error: string }>
) => {
    try {
        const { key } = req.params;
        const chat = await chatService.getOrCreateChat(key);
        const newMessages = await chatService.getMessages(key);
        res.status(200).json({ messages: newMessages, ivs: chat.salt });
    } catch (e: any) {
        if (e instanceof HttpError) {
            res.status(e.statusCode).json({ error: e.message });
        } else {
            res.status(500).json({ error: "Unknown error occurred" });
        }
    }
});

/**
 * @route POST /chat/:key
 * sends message to the specific chat given by the key
 * 
 * @param {Request<{ key: string }, {}, { sender: string, content: string, iv: string }>} req - express request with a chat key as a URL parameter and sender, message content, and iv in the request body.
 * @param {Response<messagesModel | string>} res - response containing the new message or an error
 * @returns {Promise<void>} - JSON response with the new message or an error
 */
chatRouter.post("/chat/:key", async (
    req: Request<{ key: string }, {}, { sender: string, content: string, iv: string }>,
    res: Response<messagesModel | string>
) => {
    try {
        const { key } = req.params;
        const sender: string = req.body.sender;
        const content: string = req.body.content;
        const iv : string = req.body.iv
        const message = await chatService.sendMessage(key, sender, content, iv);
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


/**
 * @route GET /chats
 * retrieves up to four chats using their keys
 * 
 * @param {Request<{}, {}, {}, { key1?: string, key2?: string, key3?: string, key4?: string }>} req - express request object with optional keys as query parameters
 * @param {Response<{ messages: messagesModel[], salts: (string | null)[] } | string>} res - response containing chat messages and salts or an error
 * @returns {Promise<void>} - JSON response with multiple chats combined into one or an error
 */
chatRouter.get("/chats", async (
    req: Request<{}, {}, {}, {
        key1?: string,
        key2?: string,
        key3?: string,
        key4?: string
    }>,
    res: Response<{ messages: messagesModel[], salts: (string | null)[] } | string>

) => {
    try {
        const { key1, key2, key3, key4 } = req.query;

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
