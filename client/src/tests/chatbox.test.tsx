import { render,  waitFor, screen } from "@testing-library/react";
import {ChatBox} from "../../src/components/ChatBox/ChatBox";
import { getMultipleChats } from "../api";


jest.mock("../api", () => ({
    getMultipleChats: jest.fn().mockResolvedValue({
        messages: [{ content: "testContent1" },
                   { content: "hello1" }
        ]
    }),
}));

test("Fetches and displays messages", async () => {
    render(<ChatBox activeKeys={["key1", "key2"]} />);

    await waitFor(() => {
        expect(getMultipleChats).toHaveBeenCalledWith(["key1", "key2"]);
    });
    await waitFor(() => {
        expect(screen.getByText("testContent1")).toBeInTheDocument();
        expect(screen.getByText("hello1")).toBeInTheDocument();
    });
});
