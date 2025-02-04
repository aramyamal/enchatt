import express from "express";
import { chatRouter } from "./router/chat";

export const app = express();

app.use(express.json());
app.use("/", chatRouter);

