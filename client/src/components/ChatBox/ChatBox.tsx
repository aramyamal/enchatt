import { Chat, getMultipleChats, DerivedKeys, RawKeys } from "../../api";
import { useState, useEffect } from "react";
import { MessageComponent } from "../Message/Message";
import socket from "../../socket"; // <-- Import the socket instance

export function ChatBox(props: { rawKeys: RawKeys, derivedKeys: DerivedKeys }) {
    const { rawKeys, derivedKeys } = props;

    const [chat, setChat] = useState<Chat>({ messages: [], salts: [] });

    async function loadChats(rawKeys: RawKeys) {
        try {
            const mulChat: Chat = await getMultipleChats(rawKeys);
            setChat({ messages: mulChat?.messages, salts: mulChat.salts });
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    }

    // Polling to load historical chats every 1 seconds.
    useEffect(() => {
        const interval = setInterval(() => {
            const hasNonEmptyKeys = Object.values(rawKeys)
                .some((keyObj) => keyObj?.raw.trim() !== "");

            if (hasNonEmptyKeys) {
                loadChats(rawKeys);
            } else {
                setChat({ messages: [], salts: [] });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [rawKeys]);

    // socket listener to receive new chat messages which updates 
    useEffect(() => {
        const handleNewMessage = (newMsg: any) => {
            console.log("Received new message via socket:", newMsg);
            setChat(prevChat => ({
                ...prevChat,
                messages: [...prevChat.messages, newMsg]
            }));
        };


        // attach the event listener to the socket
        // listens for 'chatMessage' events from the server
        socket.on("chatMessage", handleNewMessage);


        // a clean up function
        // makes sure the event listener is removed and therefore prevent duplicate listeners
        return () => {
            socket.off("chatMessage", handleNewMessage);
        };
    }, []);

    // console log output for when a chat is successfully rendered
    useEffect(() => {
        if (chat.messages.length > 0) {
            console.log("Displaying messages:", chat.messages);
        }
    }, [chat.messages]);

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
