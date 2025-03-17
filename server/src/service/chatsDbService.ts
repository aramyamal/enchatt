import { ChatsModel } from "../../db/chats.db";
import { messagesModel } from "../../db/messages.db";
import { IChatService } from "./IChatService";
import { HttpError } from "../errors/HttpError";
import crypto from "crypto";


/**
 * service class for handling database operations
 * implements IChatService interface
 */
export class chatsDbService implements IChatService {

    /**
     * retrieves a chat by key, or if it doesnt exist it creates a new chat
     * 
     * @param {string} key - the unique key identifying the chat
     * @returns {Promise<ChatsModel>} - a promise resolving to a chat
     */
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


    /**
     * stores a new message in the correct chat identified by the key
     * 
     * @param {string} key - the key to which chat the message should be stored
     * @param {string} sender - the senders username
     * @param {string} content - the message content
     * @param {string} iv - the initialization vector for encryption
     * @throws {HttpError} throws a 400 error if the content === "" after trim
     * @returns {Promise<messagesModel>} a promise resolving to the a message
     */
    async sendMessage(key: string, sender: string, content: string, iv: string): Promise<messagesModel> {
         //remove trailing white space and check if resulting is empty
        if (!content.trim()) {
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


    /**
     * retrieves a chat(all messages) associated with a given key
     * 
     * @param {string} key - the chat key
     * @returns {Promise<messagesModel[]>} - a promise resolving to an array of messages
     */
    async getMessages(key: string): Promise<messagesModel[]> {
        const messages = await messagesModel.findAll({ where: { chatKey: key } });
        return messages
    }


    /**
     * retrieves up to four chats using their identifying keys
     * if a chat does not exist, it will be created
     * 
     * @param {string} key1 - the first chat key
     * @param {string} key2 - the second chat key
     * @param {string} key3 - the third chat key
     * @param {string} key4 - the fourth chat key
     * @returns {Promise<{ messages: messagesModel[], salts: (string | null)[] }>} - a promise resolving to an object containing a combined chat (array of messages) and an array of salts.
     */
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
    
            // fetch updated messages after update
            const updatedMessages = await messagesModel.findAll({ where: { chatKey: key } });
    
            allMessages.push(...updatedMessages);
        }

        allMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return { messages: allMessages, salts };
    }
}
