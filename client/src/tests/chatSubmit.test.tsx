import { render, fireEvent, waitFor } from "@testing-library/react";
import { ChatSubmit } from "../../src/components/ChatSubmit/ChatSubmit";
import { createMessage } from "../api";

jest.mock('../api', ()=> ({
    createMessage: jest.fn(),
    getKeyClass: jest.fn(() => "default-key-class"),
}));

describe('ChatSubmit', () => {
    it('Should send a message with correct key when enter is pressed, assuming that the selected key is key1', async() => {
        const {getByPlaceholderText } = render(<ChatSubmit onKeyChange={()=>{}}/>);
        const inputField = getByPlaceholderText('Enter message for Key 1...');
        
        const keyInputField = getByPlaceholderText('Key 1');
        fireEvent.change(keyInputField, { target: { value: 'some-key-value' } });
        
        const messageInputField = getByPlaceholderText('Enter message for Key 1...');
        fireEvent.change(messageInputField, { target: { value: 'Hi friends' }});

        fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(createMessage).toHaveBeenCalledWith('browser_user', 'Hi friends', 'some-key-value');
        });
    });
});

    