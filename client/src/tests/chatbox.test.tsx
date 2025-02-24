import { render, waitFor, screen, act } from "@testing-library/react";
import { ChatBox } from "../../src/components/ChatBox/ChatBox";
import { getMultipleChats } from "../api";


jest.mock("../api", () => ({
  getMultipleChats: jest.fn(),
  getKeyClass: jest.fn(() => "default-key-class"),
}));

describe('Chatbox', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      (getMultipleChats as jest.Mock).mockReset();
    });
  
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
  

  it("Fetches and displays messages", async () => {
    (getMultipleChats as jest.Mock).mockResolvedValue({
      messages: [
        { sender: "test_user1", content: "testContent1", time: Date.now() },
        { sender: "test_user2", content: "hello1", time: Date.now() }
      ]
    });
    
    await act(async() =>{
      render(<ChatBox activeKeys={["key1", "key2"]} />);
    });

    await waitFor(() => {
      expect(getMultipleChats).toHaveBeenCalledWith(["key1", "key2"]);
      expect(screen.getByText("testContent1")).toBeInTheDocument();
      expect(screen.getByText("hello1")).toBeInTheDocument();
    });
  });

  it('Should update messages every 3 seconds', async () => {
    (getMultipleChats as jest.Mock).mockResolvedValueOnce({ messages: [] });
    
    await act(async() =>{
      render(<ChatBox activeKeys={['key1']} />)
    });
    

    await waitFor(() => {
        expect(screen.queryByTestId('message')).not.toBeInTheDocument();
    });

    (getMultipleChats as jest.Mock).mockResolvedValueOnce({
        messages: [{
        sender: 'browser_user',
        content: 'Hi friends',
        time: Date.now()
        }]
    });

    await act(async () => {
        jest.advanceTimersByTime(3000);
    });
  
    await waitFor(() => {
        expect(screen.getByText('Hi friends')).toBeInTheDocument();
        expect(getMultipleChats).toHaveBeenCalledTimes(2);
        });
    });
});
