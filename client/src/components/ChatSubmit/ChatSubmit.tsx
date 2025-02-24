import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import { KeyString, Message, createMessage, getKeyClass } from "../../api";
import React from "react";

export function ChatSubmit(
    { onKeyChange }: { onKeyChange: (activeKeys: string[]) => void }
) {

    const [selectedKey, setSelectedKey] = useState<string>("Key 1");
    const [newMessage, setNewMessage] = useState<string>("");
    const [keyValues, setKeyValues] = useState<Map<string, string>>(new Map([
        ["Key 1", ""],
        ["Key 2", ""],
        ["Key 3", ""],
        ["Key 4", ""]
    ]));

    const handleKeyChange = (keyName: string, value: string) => {
        const updatedKeyValues = new Map(keyValues);
        updatedKeyValues.set(keyName, value);
        setKeyValues(updatedKeyValues);

        // retrieve the keys which are active
        const activeKeys = Array.from(updatedKeyValues.entries())
            // Extract values from keyValues
            .map(([_, v]) => v.trim());
        // send updated keys to App.tsx
        onKeyChange(activeKeys);
    };

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedKey(eventKey);
        }
        return;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const keyValue = keyValues.get(selectedKey) || '';
            sendMessage(newMessage, keyValue);
        }
    };

    async function sendMessage(content: string, key: string) {
        try {
            createMessage("browser_user", content, key);
        } catch (error) {
            console.error("Failed to send chat to key ", key);
        }
    }

    // global keyboard event listener for key switching
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Check for Ctrl+1, Ctrl+2, etc.
            if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault(); // Prevent default browser action
                const keyNumber = parseInt(e.key);
                const keyName = `Key ${keyNumber}`;
                setSelectedKey(keyName);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);

        // clean up event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, []);

    return (
        <div className="p-2 bg-body-secondary rounded-bottom shadow-lg rounded-4">
            <InputGroup className="">
                <Form.Control
                    className={`border-0 bg-transparent my-2 `}
                    onChange={(e) => { setNewMessage(e.target.value); }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Enter message for ${selectedKey}...`}
                    aria-label="Key select"
                />

                <Dropdown
                    onSelect={handleSelect}>
                    <Dropdown.Toggle className={`bg-transparent border-0 
                        ${getKeyClass(selectedKey as KeyString)}`}
                    >
                        {selectedKey}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="">
                        {[...keyValues.keys()].map((key) => (
                            <Dropdown.Item
                                className={`${getKeyClass(key as KeyString)}`}
                                key={key}
                                eventKey={key}
                            >
                                {key}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </InputGroup>

            <InputGroup>
                {[1, 2, 3, 4].map((nr) => (
                    <React.Fragment key={nr}>
                        <Form.Control
                            className={`
                                ms-2
                                border-0
                                form-control-sm
                                rounded
                                ${getKeyClass(`Key ${nr}` as KeyString)}
                            `}
                            placeholder={`Key ${nr}`}
                            aria-label={`Key ${nr}`}
                            onChange={(e) => handleKeyChange(`Key ${nr}`, e.currentTarget.value)}
                            value={keyValues.get(`Key ${nr}`) || ""}
                        />
                        <InputGroup.Text
                            className={
                                `me-2 border-0 bg-transparent 
                                ${getKeyClass(`Key ${nr}` as KeyString)}
                            `}
                        >
                            {keyValues.get(`Key ${nr}`)?.trim() !== "" ? (
                                <i className="bi bi-square-fill"></i>
                            ) : (
                                <i className="bi bi-square"></i>
                            )}
                        </InputGroup.Text>
                    </React.Fragment>
                ))}
            </InputGroup>
        </div>
    )
}