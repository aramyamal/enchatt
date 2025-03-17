import { ChatsModel } from "../../db/chats.db";
import { messagesModel } from "../../db/messages.db";
import { IChatService } from "./IChatService";
import { HttpError } from "../errors/HttpError";
import crypto from "crypto";

export class chatsDbService implements IChatService {
    async getOrCreateChat(key: string): Promise<ChatsModel> {
        let chat = await ChatsModel.findByPk(key)
        if (!chat) {
            return ChatsModel.create({
                key: key,
                salt: crypto.randomBytes(16).toString("base64")
            })
        }
        return chat;

    }

    async sendMessage(key: string, sender: string, content: string, iv: string): Promise<messagesModel> {
        if (!content.trim()) { //remove trailing white space and check if resulting is empty
            throw new HttpError(400, "Message content empty.");
        }
        const message = await messagesModel.create({
            chatKey: key,
            sender: sender,
            content: content,
            iv: iv
        })
        return message;
    }

    async getMessages(key: string): Promise<messagesModel[]> {
        const messages = await messagesModel.findAll({ where: { chatKey: key } });
        return messages
    }

    async getOrCreateMultipleChats(key1: string, key2: string, key3: string, key4: string): Promise<{ messages: messagesModel[], salts: (string | null)[] }> {
        const keys: string[] = [key1, key2, key3, key4];
        const allMessages: any[] = [];
        const salts: (string | null)[] = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const [chat, _] = await ChatsModel.findOrCreate({
                where: { key: key },
                defaults: {
                    key: key,
                    salt: crypto.randomBytes(16).toString("base64")
                }
            });

            salts.push(chat.salt);

            // update 'key' in database
            for (const msg of messages) {
                await msg.update({
                    key: `Key ${i + 1}` as "Key 1" | "Key 2" | "Key 3" | "Key 4"
                });
            }
    
            // fetch updated messages after update
            const updatedMessages = await messagesModel.findAll({ where: { chatKey: key } });
    
            allMessages.push(...updatedMessages);
        }

        allMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return { messages: allMessages, salts };
    }
}
