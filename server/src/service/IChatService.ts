import { ChatsModel } from "../../db/chats.db";
import { messagesModel } from "../../db/messages.db";

/**
 * an interface defining the operations done by a chat service
 */
export interface IChatService {
    
    /**
     * retrieves a chat by key, or if it doesnt exist it creates a new chat
     * 
     * @param {string} key - the unique key identifying the chat
     * @returns {Promise<ChatsModel>} - a promise resolving to a chat
     */
    getOrCreateChat(key: string): Promise<ChatsModel>;

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
    sendMessage(
        key: string, 
        sender: string, 
        content: string, 
        iv: string
    ): Promise<messagesModel>;

    /**
     * retrieves a chat(all messages) associated with a given key
     * 
     * @param {string} key - the chat key
     * @returns {Promise<messagesModel[]>} - a promise resolving to an array of messages
     */
    getMessages(key: string): Promise<messagesModel[]>;

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
    getOrCreateMultipleChats(
        key1: string, 
        key2: string, 
        key3: string, 
        key4: string
    ): Promise<{ messages: messagesModel[], salts: (string | null)[] }>;
}
