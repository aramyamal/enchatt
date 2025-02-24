import { Message, Chat, getMultipleChats } from "../../api";
import { useState, useEffect } from "react";
import { MessageComponent } from "../Message/Message";

export function ChatBox(props: { activeKeys: string[] }) {
    const { activeKeys } = props;

    const [chat, setChat] = useState<Chat>({ messages: [] });


    async function loadChats(keys: string[]) {
        const multipleChats: Chat = await getMultipleChats(keys);

        setChat({ messages: multipleChats.messages })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeKeys.some(key => key.trim() !== "")) {
                loadChats(activeKeys);
            }
        }, 3000); // call every 3 seconds

        return () => clearInterval(interval);
    }, [activeKeys]); // activeKey as dependency

    return (
        <>
            {chat && chat.messages.map((message) => (
                MessageComponent({ message })
            ))}
        </>
    )
}
