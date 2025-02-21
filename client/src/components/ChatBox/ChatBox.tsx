import { Chat, getMultipleChats} from "../../api";
import { useState, useEffect } from "react";
import { MessageComponent } from "../Message/Message";

export function ChatBox(props: { activeKeys: string[] }) {
    const { activeKeys } = props;

    const [chat, setChat] = useState<Chat>({ messages: [] });


    async function loadChats(keys : string[]) {
        try {
            const multipleChats: Chat | null = await getMultipleChats(keys);
            setChat({ messages: multipleChats?.messages || [] });
        } catch (error) {
            console.error("Failed to load chats", error);
            setChat({ messages: [] });
        }
    }

    useEffect(() => {
        loadChats(activeKeys);
        const interval = setInterval(() => {
                loadChats(activeKeys);
        }, 3000); // call every 3 seconds

        return () => clearInterval(interval);
    }, [activeKeys]); // activeKey as dependency

    return (
        <>
            {chat.messages.map((message, index) => (
                <MessageComponent key={index} message={message} />
            ))}
        </>
    );
}
