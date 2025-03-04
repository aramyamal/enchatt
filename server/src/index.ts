import { app } from "./start";
import {setupAssociations} from "../db/assc"


/**
* App Variables
*/


const PORT : number = 8080;


/**
* Server Activation
*/


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
setupAssociations();



