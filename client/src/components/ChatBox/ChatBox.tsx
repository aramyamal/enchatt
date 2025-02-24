import { Chat, getMultipleChats } from "../../api";
import { useState, useEffect} from "react";
import { MessageComponent } from "../Message/Message";

export function ChatBox(props: { activeKeys: string[] }) {
    const { activeKeys } = props;

    const [chat, setChat] = useState<Chat>({ messages: [] });


    async function loadChats(keys: string[]) {
        try {
            const multipleChats: Chat = await getMultipleChats(keys);
            setChat({ messages: multipleChats?.messages })
        }catch (error){
            console.error("Failed to fetch chats:", error);
        }   
    }

    useEffect(() => {
        loadChats(activeKeys);
        const interval = setInterval(() => {
            if (activeKeys.some(key => key.trim() !== "")) {
                loadChats(activeKeys);
            } else {
                setChat({ messages: [] });
            }
        }, 3000); // call every 3 seconds

        return () => clearInterval(interval);
    }, [activeKeys]); // activeKey as dependency

    return (
        <>
          {chat.messages.map((message, index) => (
            <MessageComponent key={`message-${index}`} message={message} />
          ))}
        </>
      );
}