import { Chat, getChat } from "../../api";
import { useState, useEffect } from "react";
import { MessageComponent } from "../Message/Message";

export function ChatBox(props: { activeKey: string }) {
    const { activeKey } = props;

    const [chat, setChat] = useState<Chat>({ messages: [] });

    async function loadChats(key: string) {
        try {
            const chat = await getChat(key);
            setChat(chat);
        } catch (error) {
            console.error("Failed to load chat:", error);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            loadChats(activeKey);
        }, 3000); // call every 3 seconds

        return () => clearInterval(interval); 
    }, [activeKey]); // activeKey as dependency

    return (
        <>
            {chat && chat.messages.map((message) => (
                MessageComponent({ message })
            ))}
        </>
    )
}
