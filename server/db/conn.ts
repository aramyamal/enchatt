import { Sequelize } from 'sequelize';

const dotenv = require("dotenv");
(0, dotenv.config)();
const key = process.env.DB_URL ;
if (!key) {
    throw new Error("Error: No database key found")
}
export const sequelize = new Sequelize(key, {
    logging: console.log, 
});



