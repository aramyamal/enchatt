import { httpServer } from "./start";  // Import the HTTP server, NOT just `app`

const PORT: number = 8080;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});