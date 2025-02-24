import { render, screen } from '@testing-library/react';
import { MessageComponent } from '../../src/components/Message/Message';
import { KeyString } from '../api';

describe('Message', ()=> {
    it('Should display the message and the sender',() => {
        const testMessage = {
            sender : 'browser_user',
            content: 'Hi friends',
            time: 12345,
            key: 'Key 1' as KeyString
        }

        render(<MessageComponent message ={testMessage}/>);

        expect(screen.getByText('browser_user:')).toBeInTheDocument();
        expect(screen.getByText('Hi friends')).toBeInTheDocument();
    });
});