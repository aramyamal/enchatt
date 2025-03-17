/** @jest-environment jsdom */
import { render, screen, waitFor } from "@testing-library/react";
import { ChatBox } from "../components/ChatBox/ChatBox";
import { getMultipleChats } from "../api";
import socket from "../utils/socket";
import { act } from "@testing-library/react";


Element.prototype.scrollTo = jest.fn();

jest.mock("../api", () => ({
  getMultipleChats: jest.fn(),
}));

jest.mock("../utils/socket", () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
}));

jest.mock('../utils/encryption', () => ({
  deriveAesKey: jest.fn().mockResolvedValue({} as CryptoKey),
  decrypt: jest.fn().mockImplementation(async (ciphertext: string, _iv: string, _aesKey: CryptoKey) => ({
    success: true,
    message: {
      'encrypted1': 'tjena1',
      'encrypted2': 'tjena2',
      'wassap': 'wassap'
    }[ciphertext] || ''
  })),
}));

describe("ChatBox Integration Test", () => {
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
    (getMultipleChats as jest.Mock).mockResolvedValue({ 
      messages: mockMessages, 
      salts: ["salt1", "salt2"] 
    });
  });

  it("fetches and displays messages from API", async () => {
    render(<ChatBox rawKeys={mockRawKeys} derivedKeys={mockDerivedKeys} />);
    
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("tjena1"))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes("tjena2"))).toBeInTheDocument();
    });
  });

  it("handles new messages from WebSocket", async () => {
    render(<ChatBox rawKeys={mockRawKeys} derivedKeys={mockDerivedKeys} />);
    await screen.findByText((content) => content.includes("tjena1"));

    await act(async () => {
      const newMessage = { 
        id: 3, 
        chatKey: 'hashed1', 
        content: 'wassap', 
        iv: 'mock-iv-3',
        sender: 'user3',
        createdAt: new Date("2023-01-03") 
      };
      
      const socketHandler = (socket.on as jest.Mock).mock.calls
        .find(([event]) => event === "receiveMessage")?.[1];
      socketHandler?.(newMessage);
    });

    await waitFor(() => {
      expect(screen.getByText("wassap")).toBeInTheDocument();
    });
  });
});