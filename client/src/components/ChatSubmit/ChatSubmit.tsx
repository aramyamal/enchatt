import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useState} from "react";
import { createMessage } from "../../api";
import React from "react";

export function ChatSubmit(
    { onKeyChange }: { onKeyChange: (activeKeys : string[]) => void }
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
        // only keep non-empty values
            .filter(([_, v]) => v !== "") 
            // Extract values from keyValues
            .map(([_, v]) => v); 
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

    return (
        <div className="">
            <InputGroup className="">
                <Form.Control
                    onChange={(e) => { setNewMessage(e.target.value); }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Enter message for ${selectedKey}...`}
                    aria-label="Key select"
                />

                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle className="">
                        {selectedKey}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="">
                        {[...keyValues.keys()].map((name) => (
                            <Dropdown.Item
                                key={name}
                                eventKey={name}
                            >
                                {name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </InputGroup>

            <InputGroup>
                {[1, 2, 3, 4].map((nr) => (
                    <React.Fragment key={nr}>
                        <InputGroup.Text>⊛</InputGroup.Text>
                        <Form.Control
                            placeholder={`Key ${nr}`}
                            aria-label={`Key ${nr}`}
                            onChange={(e) => handleKeyChange(`Key ${nr}`, e.currentTarget.value)}
                            value={keyValues.get(`Key ${nr}`) || ""}
                        />
                    </React.Fragment>
                ))}
            </InputGroup>
        </div>
    )
}
