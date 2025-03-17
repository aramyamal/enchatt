import * as SuperTest from "supertest";
import { app } from "../start";
import crypto from "crypto";
import { sequelize } from "../../db/conn";

const request = SuperTest.default(app);


test("After sending a message to a key, that message should remain after fetching the same chat again", async () => {
    // initialize a database 
    await sequelize.sync({ force: true });
    const testKey: string = crypto.randomBytes(16).toString("hex");
    const content: string = "test content.";
    const sender: string = "testSender";
    const testIv: string = crypto.randomBytes(12).toString("hex");

    // create the chat for the key
    const getRes = await request.get(`/chat/${testKey}`);
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toHaveProperty("messages");
    expect(getRes.body).toHaveProperty("ivs");

    // send a message to the chat associated with that key
    const postRes = await request
        .post(`/chat/${testKey}`) 
        .send({ sender, content, iv: testIv })
        .set("Content-Type", "application/json");

    expect(postRes.statusCode).toEqual(201);
    expect(postRes.body).toHaveProperty("sender", sender);
    expect(postRes.body).toHaveProperty("content", content);

    // retrieve the chat associated with the same key
    const getRes2 = await request.get(`/chat/${testKey}`);
    expect(getRes2.statusCode).toEqual(200);
    expect(getRes2.body).toHaveProperty("messages");
    expect(getRes2.body.messages.length).toBeGreaterThan(0);
    expect(getRes2.body.messages[0]).toHaveProperty("sender", sender);
    expect(getRes2.body.messages[0]).toHaveProperty("content", content);
});
