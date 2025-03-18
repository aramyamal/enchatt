import { render, screen, waitFor } from "@testing-library/react";
import { MessageComponent } from "../../src/components/Message/Message";
import { KeyString, RawKeys, DerivedKeys } from "../utils/keys";

jest.mock("../utils/encryption", () => ({
  decrypt: jest.fn().mockImplementation(async (ciphertext: string) => ({
    success: true,
    decrypted: ciphertext === "encrypted_user" ? "browser_user" : "tjena",
  })),
}));

describe("MessageComponent", () => {
  const mockDerivedKeys: DerivedKeys = {
    key1: {} as CryptoKey,
  };

  const mockRawKeys: RawKeys = {
    key1: {
      raw: "raw1",
      hashed: "hashed1",
      salt: "salt1",
    },
  };

  const testMessage = {
    id: 1,
    chatKey: "hashed1",
    sender: "encrypted_user",
    content: "encrypted_msg",
    iv: "mock-iv-1",
    time: 12345,
    key: "Key 1" as KeyString,
  };

  it("Should display decrypted message and sender", async () => {
    render(
      <MessageComponent
        message={testMessage}
        derivedKeys={mockDerivedKeys}
        rawKeys={mockRawKeys}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("browser_user:")).toBeInTheDocument();
      expect(screen.getByText("tjena")).toBeInTheDocument();
    });
  });
});