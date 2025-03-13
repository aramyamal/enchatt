import { io } from "socket.io-client";

/**
 * the client-side socket which establishes a connection to the server-side socket
 *
 * @constant {Socket} socket - the socket connection instance
 */
const socket = io("http://localhost:8080", { withCredentials: true });

/**
 * event listener for the 'connect' event
 * utputs a message to the console log when a user connects to the server
 */
socket.on("connect", () => {
    console.log("Socket connected with id:", socket.id);
});

export default socket;
