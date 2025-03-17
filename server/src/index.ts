import { httpServer } from "./start";
import { setupAssociations } from "../db/assc";

const PORT: number = 8080;

/**
 * starts the HTTP server and sets up database associations

 * 
 * @constant {number} PORT - the port which the server will run on
 */
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

/**
 * initializes database associations
 */
setupAssociations();

