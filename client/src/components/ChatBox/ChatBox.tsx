import { Button } from "react-bootstrap";
import classes from "./ChatBox.module.css";
import Card from "react-bootstrap/Card";
import { Chat, getChat } from "../../api";
import { useState, useEffect } from "react";
import { MessageComponent } from "../Message/Message";

export const ChatBox: React.FC = () => {

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
            loadChats("testkey");
        }, 3000); // Call every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <>
            {chat && chat.messages.map((message) => (
                MessageComponent({ message })
            ))}
        </>
    )
}
