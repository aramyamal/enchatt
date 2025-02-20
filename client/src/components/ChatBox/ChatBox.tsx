import { Message, Chat, getMultipleChats} from "../../api";
import { useState, useEffect } from "react";
import { MessageComponent } from "../Message/Message";

export function ChatBox(props: { activeKeys: string[] }) {
    const { activeKeys } = props;

    const [chat, setChat] = useState<Chat>({ messages: [] });


    async function loadChatsss(keys : string[]) {
        const multipleChats : Chat[] = await getMultipleChats(keys);
        const theChatttt : Message[] = [];

        multipleChats.forEach((chat) => {
            theChatttt.push(...chat.messages)
        })
        setChat({messages : theChatttt})
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeKey.trim() != "") {
                loadChats(activeKey);
            }
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
