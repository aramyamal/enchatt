import { httpServer } from "./start";
import { setupAssociations } from "../db/assc"

const PORT: number = 8080;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
setupAssociations();
