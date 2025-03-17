import express from "express";
import { chatRouter } from "./router/chat";
import cors from "cors";
import { createServer } from "http";
import { sequelize } from "../db/conn";
import { initializeSocket } from "./socket";

export const app = express();
export const httpServer = createServer(app);

/**
 * configures express middleware and routes
 * 
 * - parses incoming JSON requests
 * - enables CORS for frontend communication
 */
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/", chatRouter);

/**
 * initializes and exports the WebSocket server
 * 
 * @constant {import("socket.io").Server} io - the WebSocket server instance
 */
export const io = initializeSocket(httpServer);

/**
 * synchronizes the Sequelize database
 * 
 * - if `force: true` is set, it drops and recreates all tables
 * - logs the database synchronization status to the console
 */
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error: unknown) => {
    console.error('Error syncing database:', error);
  });
