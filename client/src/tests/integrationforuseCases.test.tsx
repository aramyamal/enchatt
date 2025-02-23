import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChatBox } from "../components/ChatBox/ChatBox";
import { getMultipleChats } from "../api";
import { ChatSubmit } from "../components/ChatSubmit/ChatSubmit";


// Mock the API function
jest.mock("../api", () => ({
    getMultipleChats: jest.fn(),
    createMessage: jest.fn(),
}));



describe('Integration test', () => {
    it('Should handle api errors ', async() => {
        (getMultipleChats as jest.Mock).mockRejectedValue(new Error('Api error'));
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        render(<ChatBox activeKeys={['key1']} />);

        await waitFor(() => {
            expect(screen.queryByText('Hi friends')).not.toBeInTheDocument();
        });
        
        consoleErrorSpy.mockRestore();
    });

    it('Should update selected key when it changes in dropdown list', async () => {
        const { container } = render(<ChatSubmit onKeyChange={() => {}} />);
        
        // Find dropdown toggle using DOM query
        const dropdownToggle = container.querySelector('.dropdown-toggle.btn.btn-primary');
        if (!dropdownToggle) throw new Error('Dropdown toggle not found');
        
        // Open dropdown
        fireEvent.click(dropdownToggle);
        
        // Find Key 2 menu item using text match
        const key2Item = screen.getByRole('button', { name: /^Key 2$/i });
        
        // Select Key 2
        fireEvent.click(key2Item);
        
        // Verify updated toggle text
        const updatedToggle = container.querySelector('.dropdown-toggle.btn.btn-primary');
        expect(updatedToggle?.textContent).toMatch(/Key 2/i);
    });
});     