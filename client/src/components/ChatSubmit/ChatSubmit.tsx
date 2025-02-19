import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import { Message, createMessage } from "../../api";

export const ChatSubmit: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState<string>("Key 1");
    const [newMessage, setNewMessage] = useState<string>("");
    const [keyValues, setKeyValues] = useState<Map<string, string>>(new Map([
        ["Key 1", ""],
        ["Key 2", ""],
        ["Key 3", ""],
        ["Key 4", ""]
    ]));

    const handleKeyChange = (keyName: string, value: string) => {
        setKeyValues(new Map(keyValues.set(keyName, value)));
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
                    <>
                        <InputGroup.Text className="">⊛</InputGroup.Text>
                        <Form.Control
                            placeholder={`Key ${nr}`}
                            aria-label={`Key ${nr}`}
                            onChange={
                                (e) =>
                                    handleKeyChange(`Key ${nr}`, e.target.value)
                            }
                            value={keyValues.get(`Key ${nr}`)}
                        />
                    </>
                ))}
            </InputGroup>
        </div>
    )
}
