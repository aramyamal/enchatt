import express from "express";
import { chatRouter } from "./router/chat";
import cors from "cors";
import { sequelize } from "../db/conn";

export const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // allow credentials (cookies, auth headers)
}));
app.use("/", chatRouter);



sequelize.sync({force : false})
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
