import { ChatsModel } from "../../db/chats.db";
import { messagesModel } from "../../db/messages.db";
import { IChatService } from "./IChatService";
import { HttpError } from "../errors/HttpError";
import { Message } from "../model/message.interface";

export class chatsDbService implements IChatService {
    async getOrCreateChat(key: string): Promise<Chat> {
        let chat = await ChatsModel.findByPk(key)
        if (!chat){
            return ChatsModel.create({
                key : key
            })
        }
        return ChatsModel.findByPk(key);

    }

    async sendMessage(key: string, sender: string, content: string): Promise<Message> {
        if (!content.trim()) { //remove trailing white space and check if resulting is empty
            throw new HttpError(400, "Message content empty.");
        }
        const message = await messagesModel.create({
            chatKey : key,
            sender : sender,
            time : new Date(),
            content : content,
            key : 'Key 1'
        })
        return message;
    }

    async getOrCreateMultipleChats(key1: string, key2: string, key3: string, key4: string): Promise<Chat> {
        const keys : String [] = [key1,key2,key3,key4];
        const allMessages : Message[] = [];

        for(const key of keys){
            let chat = await ChatsModel.findByPk(key);
            if (!chat){
                chat = await ChatsModel.create({key : key});
            }

            const messages = await messagesModel.findAll({where : {chatKey :key}})
            allMessages.push(...messages);
        }  
        allMessages.sort((a, b) => a.time - b.time);
        return { messages: allMessages };
    }
}