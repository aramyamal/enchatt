export interface IChatService {
    getOrCreateChat(key: string): Promise<Chat>
    sendMessage(key: string, sender: string, content: string): Promise<Message>
    getOrCreateMultipleChats(
        key1: string,
        key2: string,
        key3: string,
        key4: string
    ): Promise<Chat>
}