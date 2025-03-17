import * as SuperTest from "supertest";
import { app } from "../start";
import crypto from "crypto";

const request = SuperTest.default(app);

test("After sending a message to a key, that message should remain after " +
    "fetching the same chat again", async () => {
        const testKey: string = crypto
            .randomBytes(crypto.randomInt(32) + 1)
            .toString("hex");
        const content: string = "test content.";
        const sender: string = "testSender";
        const testIv: string = crypto.randomBytes(12).toString("hex");

        // create the chat for the key
        const getRes: SuperTest.Response = await request
            .get(`/chat/${testKey}`);
        expect(getRes.statusCode).toEqual(200);

        // send a message to the chat associated with that key
        const postRes: SuperTest.Response = await request
            .post("/chat/")
            .send({ key: testKey, sender: sender, content: content, iv: testIv});
        expect(postRes.statusCode).toEqual(201);

        // retrieve the chat associated with the same key
        const getRes2 = await request
            .get(`/chat/${testKey}`);
        expect(getRes2.statusCode).toEqual(200);
        expect(getRes2.body.messages[0].sender).toEqual(sender);
        expect(getRes2.body.messages[0].content).toEqual(content);
    });