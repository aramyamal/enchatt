import { ChatsModel } from "../../db/chats.db";
import { messagesModel } from "../../db/messages.db";
import { IChatService } from "./IChatService";
import { HttpError } from "../errors/HttpError";
import crypto from "crypto";

export class chatsDbService implements IChatService {
    async getOrCreateChat(key: string): Promise<ChatsModel> {
        let chat  = await ChatsModel.findByPk(key)
        if (!chat){
            return ChatsModel.create({
                key : key,
                salt : crypto.randomBytes(16).toString("base64")
            })
        }
        return chat;

    }

    async sendMessage(key: string, sender: string, content: string, iv: string): Promise<messagesModel> {
        if (!content.trim()) { //remove trailing white space and check if resulting is empty
            throw new HttpError(400, "Message content empty.");
        }
        const message = await messagesModel.create({
            chatKey : key,
            sender : sender,
            content : content,
            key : 'Key 1',
            iv : iv
        })
        return message;
    }

    async getMessages(key: string): Promise <messagesModel[]>{
        const messages = await messagesModel.findAll({where : {chatKey: key}});
        return messages
    }

    async getOrCreateMultipleChats(key1: string, key2: string, key3: string, key4: string): Promise<{ messages: messagesModel[], salts: (string | null)[] }> {
        const keys: string[] = [key1, key2, key3, key4].filter(Boolean);
        const allMessages : messagesModel[] = [];
        const salts : (string| null)[] = [];

        for(let i = 0; i < keys.length; i ++){
            const key = keys[i]
            let chat = await ChatsModel.findByPk(key);
            
            if (!chat) {
                const existingMessages = await messagesModel.findAll({where : {chatKey: key}});
                if (existingMessages.length == 0) {
                    chat = await ChatsModel.create({ key: key, salt : "" });
                }
            }

            salts.push(chat ? chat.salt : null);
            
            const messages = await messagesModel.findAll({where: { chatKey: key }});

            const UpdatedMessages = messages.map(msg => ({
                ...msg.get({plain : true}),
                key : `Key ${i + 1}` as "Key 1" | "Key 2" | "Key 3" | "Key 4", 
            }));

            allMessages.push(...UpdatedMessages);
        }  
        allMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return { messages : allMessages, salts};
    }
}