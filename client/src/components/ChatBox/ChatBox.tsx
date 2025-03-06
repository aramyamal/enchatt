import { Chat, getMultipleChats, DerivedKeys, RawKeys } from "../../api";
import { useState, useEffect } from "react";
import { MessageComponent } from "../Message/Message";

export function ChatBox(props: { rawKeys: RawKeys, derivedKeys: DerivedKeys }) {
    const { rawKeys: rawKeys, derivedKeys: derivedKeys } = props;

    const [chat, setChat] = useState<Chat>({ messages: [], salts: [] });


    async function loadChats(rawKeys: RawKeys) {
        try {
            const mulChat: Chat = await getMultipleChats(rawKeys);
            setChat({ messages: mulChat?.messages, salts: mulChat.salts })
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const hasNonEmptyKeys = Object.values(rawKeys)
                .some((keyObj) => keyObj?.raw.trim() !== "");

            if (hasNonEmptyKeys) {
                loadChats(rawKeys);
            } else {
                setChat({ messages: [], salts: [] });
            }
        }, 3000); // call every 3 seconds

        return () => clearInterval(interval);
    }, [rawKeys]); // rawKeys as dependency
    
    return (
        <>
            {chat.messages.map((message, index) => (
                <MessageComponent
                    key={`message-${index}`}
                    message={message} 
                    derivedKeys={derivedKeys}
                    />
            ))}
        </>
    );
}
