import { render, fireEvent, waitFor } from "@testing-library/react";
import { ChatSubmit } from "../../src/components/ChatSubmit/ChatSubmit";
import { createMessage } from "../api";

jest.mock('../api', ()=> ({
    createMessage: jest.fn(),
}));

describe('ChatSubmit', () => {
    it('Should send a message with correct key when enter is pressed, assuming that the selected key is key1', async() => {
        const {getByPlaceholderText } = render(<ChatSubmit onKeyChange={()=>{}}/>);
        const inputField = getByPlaceholderText('Enter message for Key 1...');

        fireEvent.change(inputField, {target: {value: 'Hi friends'}});

        fireEvent.keyDown(inputField, {key:'Enter', code: 'Enter'});

        await waitFor(() => {
            expect(createMessage).toHaveBeenCalledWith('browser_user', 'Hi friends', '');
        });
    });
});

    