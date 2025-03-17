import express from "express";
import { chatRouter } from "./router/chat";
import cors from "cors";
import { createServer } from "http";
import { sequelize } from "../db/conn";
import { initializeSocket } from "./socket";


export const app = express();
export const httpServer = createServer(app);


app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/", chatRouter);


// initialize server side socket
export const io = initializeSocket(httpServer);

sequelize.sync({force : true})
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error: unknown) => {
    console.error('Error syncing database:', error);
  });
