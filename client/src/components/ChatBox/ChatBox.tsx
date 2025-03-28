import { DerivedKeys, RawKeys, RawKeyObject } from "../../utils/keys";
import { Chat, getMultipleChats, } from "../../api";
import { useState, useEffect, useRef } from "react";
import { MessageComponent } from "../Message/Message";
import socket from "../../utils/socket"; // <-- Import the socket instance


/**
 * ChatBox component displays the chat messages and handles real-time updates via WebSockets
 *
 * @param {Object} props - props
 * @param {RawKeys} props.rawKeys - the raw encryption keys used for retrieving chats
 * @param {DerivedKeys} props.derivedKeys - the derived encryption keys for decrypting messages
 * @returns {JSX.Element} - the rendered chat box component
 */
export function ChatBox(props: { rawKeys: RawKeys, derivedKeys: DerivedKeys }) {
    const { rawKeys, derivedKeys } = props;

    const [chat, setChat] = useState<Chat>({ messages: [], salts: [] });
    const chatContainerRef = useRef<HTMLDivElement>(null);  // Reference to the chat container

    // function to scroll to the bottom
    const scrollToBottom = () => {
        setTimeout(() => {
            const container = chatContainerRef.current;
            if (container) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth' // Ensures smooth scrolling
                });
            }
        }, 0);
    };

    async function loadChats(rawKeys: RawKeys) {
        try {
            const mulChat: Chat = await getMultipleChats(rawKeys);
            setChat({ messages: mulChat?.messages, salts: mulChat.salts });
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    }

    useEffect(() => {
        const joinAllChatRooms = async () => {
            // Get all non-empty keys
            const nonEmptyKeys: RawKeyObject[] = Object.values(rawKeys)
                .filter(keyObj => keyObj?.raw.trim() !== "");

            // Join all chat rooms for non-empty keys
            for (const key of nonEmptyKeys) {
                const chatId = key.hashed; // Await hashKey for each key
                socket.emit("joinChat", chatId); // Join the chat room
                console.log("Joining chat:", chatId);
            }
        };

        joinAllChatRooms(); // Call the async function
    }, [rawKeys]);



    // pull chats when keys change
    useEffect(() => {
        const hasNonEmptyKeys = Object.values(rawKeys)
            .some((keyObj) => keyObj?.raw.trim() !== "");

        if (hasNonEmptyKeys) {
            loadChats(rawKeys);
        } else {
            setChat({ messages: [], salts: [] });
        }
    }, [rawKeys]);  // This runs only when rawKeys changes

    // socket listener to receive new chat messages which updates 
    useEffect(() => {
        const handleNewMessage = (newMsg: any) => {
            console.log("Received new message via socket:", newMsg);
            setChat(prevChat => ({
                ...prevChat,
                messages: [...prevChat.messages, newMsg]
            }));
            // scroll to bottom when new chat is recieved
            setTimeout(scrollToBottom, 50);
        };

        // attach the event listener to the socket
        // listens for 'chatMessage' events from the server
        socket.on("receiveMessage", handleNewMessage);


        // a clean up function
        // makes sure the event listener is removed and therefore prevent duplicate listeners
        return () => {
            socket.off("receiveMessage", handleNewMessage);
        };

    }, []);

    // console log output for when a chat is successfully rendered
    useEffect(() => {
        if (chat.messages.length > 0) {
            console.log("Displaying messages:", chat.messages);
        }
    }, [chat.messages]);

    return (
        <div
            ref={chatContainerRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%', // Take at least full height
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
                WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
            }}
            className="hide-scrollbar"
        >
            <div style={{
                marginTop: 'auto',
                width: '100%',
                maxWidth: '100%'
            }}>
                {chat.messages.map((message, index) => (
                    <MessageComponent
                        key={`message-${index}`}
                        message={message}
                        derivedKeys={derivedKeys}
                        rawKeys={rawKeys}
                    />
                ))}
            </div>
        </div>
    );
}
