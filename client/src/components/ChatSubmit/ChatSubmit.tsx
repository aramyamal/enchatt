import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import { KeyString, RawKeyObject, RawKeys, createMessage, getKeyClass } from "../../api";
import React from "react";

export function ChatSubmit(
    { updateDerivedKeys, updateRawKeys, username }: { updateDerivedKeys: (activeKeys: RawKeys) => void, updateRawKeys: (rawKeys:RawKeys) => void, username: string },
) {

    const [selectedKey, setSelectedKey] = useState<string>("Key 1");
    const [newMessage, setNewMessage] = useState<string>("");
    const [keyValues, setKeyValues] = useState<Map<KeyString, string>>(new Map([
        ["Key 1", ""],
        ["Key 2", ""],
        ["Key 3", ""],
        ["Key 4", ""]
    ]));

    const handleKeyChange = (keyName: KeyString, value: string) => {
        const updatedKeyValues = new Map(keyValues);
        updatedKeyValues.set(keyName, value);
        setKeyValues(updatedKeyValues);

        // send updated keys to parent component in RawKeys format with salt
        const rawKeys: RawKeys = {};
        for (const [key, rawValue] of updatedKeyValues.entries()) {
            const trimmed: string = rawValue.trim();
            if (trimmed) {
                const keyId: keyof RawKeys = convertToKeyString(key);
                rawKeys[keyId] = { raw: trimmed, salt: "temp"};
            }
        }
        updateRawKeys(rawKeys);
        updateDerivedKeys(rawKeys);
    };

    const convertToKeyString = (key: string): keyof RawKeys => {
        switch (key) {
            case "Key 1": return "key1";
            case "Key 2": return "key2";
            case "Key 3": return "key3";
            case "Key 4": return "key4";
            default: throw new Error(`Unknown key: ${key}`);
        }
    };

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedKey(eventKey);
        }
        return;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const keyValue = keyValues.get(selectedKey as KeyString);
            if (keyValue) {
                sendMessage(newMessage, {raw: keyValue});
                setNewMessage("");
            }
        }
    };

    async function sendMessage(content: string, rawKey: RawKeyObject) {
        try {
            createMessage(username, content, rawKey);
        } catch (error) {
            console.error("Failed to send chat to key ", rawKey);
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
                    className={`border-0 bg-transparent my-2 
                                ${getKeyClass(selectedKey as KeyString)}
                        `}
                    onChange={(e) => { setNewMessage(e.target.value); }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Enter message for ${selectedKey}...`}
                    aria-label="Key select"
                    value={newMessage}
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
                            onChange={(e) => handleKeyChange(`Key ${nr}` as KeyString, e.currentTarget.value)}
                            value={keyValues.get(`Key ${nr}` as KeyString) || ""}
                        />
                        <InputGroup.Text
                            className={
                                `me-2 border-0 bg-transparent 
                                ${getKeyClass(`Key ${nr}` as KeyString)}
                            `}
                        >
                            {keyValues.get(`Key ${nr}` as KeyString)?.trim() !== "" ? (
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
