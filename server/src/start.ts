import express from "express";
import { chatRouter } from "./router/chat";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/", chatRouter);

