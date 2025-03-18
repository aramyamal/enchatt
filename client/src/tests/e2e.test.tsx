/** @jest-environment jsdom */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ChatBox } from "../components/ChatBox/ChatBox";
import { getMultipleChats } from "../api";
import socket from "../utils/socket";
import { act } from "@testing-library/react";
import { Login } from '../components/Login/Login';
import { MemoryRouter } from 'react-router-dom';

Element.prototype.scrollTo = jest.fn();

jest.mock("../api", () => ({
  getMultipleChats: jest.fn(),
}));

jest.mock("../utils/socket", () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
}));

jest.mock("../utils/encryption", () => ({
  deriveAesKey: jest.fn().mockResolvedValue({} as CryptoKey),
  decrypt: jest.fn().mockImplementation(async (ciphertext: string) => ({
    success: true,
    decrypted: { // Använd "decrypted" istället för "message"
      'encrypted1': 'tjena1',
      'encrypted2': 'tjena2',
      'wassap': 'wassap'
    }[ciphertext] || ''
  })),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe("End to end tests", () => {

  const mockRawKeys = {
    key1: { raw: "raw1", hashed: "hashed1" },
    key2: { raw: "raw2", hashed: "hashed2" },
  };
  
  const mockDerivedKeys = {
    key1: {} as CryptoKey,
    key2: {} as CryptoKey,
  };

  const mockMessages = [
    { 
      id: 1, 
      chatKey: 'hashed1', 
      content: 'encrypted1', 
      iv: 'mock-iv-1',
      sender: 'user1',
      createdAt: new Date("2023-01-01") 
    },
    { 
      id: 2, 
      chatKey: 'hashed2', 
      content: 'encrypted2', 
      iv: 'mock-iv-2',
      sender: 'user2',
      createdAt: new Date("2023-01-02") 
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    (getMultipleChats as jest.Mock).mockResolvedValue({ 
      messages: mockMessages, 
      salts: ["salt1", "salt2"] 
    });
  });

  it('should login successfully', async () => {
    const mockHandleUsernameWithNavigation = jest.fn((_username: string) => {
      mockNavigate('/enchatt');
    });
  
    render(
      <MemoryRouter>
        <Login handleUsername={mockHandleUsernameWithNavigation} />
      </MemoryRouter>
    );
  
    const input = screen.getByPlaceholderText(/type your username here/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'browser_user' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
  
    await waitFor(() => {
      expect(mockHandleUsernameWithNavigation).toHaveBeenCalledWith('browser_user');
      expect(mockNavigate).toHaveBeenCalledWith('/enchatt');
    });
  });
 

  it("should create a chat", async () => {
    render(<ChatBox rawKeys={mockRawKeys} derivedKeys={mockDerivedKeys} />);
    await waitFor(() => {
      expect(getMultipleChats).toHaveBeenCalledWith(mockRawKeys);
    });

    const chatContainer = document.querySelector('.hide-scrollbar');
    expect(chatContainer).toBeInTheDocument();
    expect(chatContainer).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    });
  });

  it("should fetch and display messages from API", async () => {
    render(<ChatBox rawKeys={mockRawKeys} derivedKeys={mockDerivedKeys} />);
    
    await waitFor(() => {
      expect(screen.getByText("tjena1")).toBeInTheDocument();
      expect(screen.getByText("tjena2")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("should get new messages with socket.io", async () => {
    render(<ChatBox rawKeys={mockRawKeys} derivedKeys={mockDerivedKeys} />);
    
    await screen.findByText("tjena1");
    
    const socketHandler = (socket.on as jest.Mock).mock.calls
      .find(([event]) => event === "receiveMessage")[1];
  
    await act(async () => {
      socketHandler({ 
        id: 3, 
        chatKey: 'hashed1', 
        content: 'wassap', 
        iv: 'mock-iv-3',
        sender: 'user3',
        createdAt: new Date("2023-01-03") 
      });
    });
    await waitFor(() => {
      expect(screen.getByText("wassap")).toBeInTheDocument();
    });
  });
});
