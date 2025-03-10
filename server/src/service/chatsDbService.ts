import { ChatsModel } from "../../db/chats.db";
import { messagesModel } from "../../db/messages.db";
import { IChatService } from "./IChatService";
import { HttpError } from "../errors/HttpError";

export class chatsDbService implements IChatService {
    async getOrCreateChat(key: string): Promise<ChatsModel> {
        let chat  = await ChatsModel.findByPk(key)
        if (!chat){
            return ChatsModel.create({
                key : key
            })
        }
        return chat;

    }

    async sendMessage(key: string, sender: string, content: string): Promise<messagesModel> {
        if (!content.trim()) { //remove trailing white space and check if resulting is empty
            throw new HttpError(400, "Message content empty.");
        }
        const message = await messagesModel.create({
            chatKey : key,
            sender : sender,
            content : content,
            key : 'Key 1'
        })
        return message;
    }

    async getOrCreateMultipleChats(key1: string, key2: string, key3: string, key4: string): Promise<messagesModel[]> {
        const keys: string[] = [key1, key2, key3, key4].filter(Boolean);
        const allMessages = [];

        for(const key of keys){
            let chat = await ChatsModel.findByPk(key);
            if (!chat) {
                const messages = await messagesModel.findAll({where : {chatKey :key}})
                if (messages.length > 0){
                    continue;
                }
                chat = await ChatsModel.create({ key: key })
            }
            const messages = await messagesModel.findAll({where: { chatKey: key }})
            allMessages.push(...messages);
        }  
        allMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return allMessages;
    }
}