import { Sequelize } from 'sequelize';

const dotenv = require("dotenv");
// ensure environment variables are loaded
dotenv.config(); 

let sequelize: Sequelize;

// for test
if (process.env.NODE_ENV === "test") {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:'
    }); 
} 
// for production
else {
    const key = process.env.DB_URL;
    if (!key) {
        throw new Error("DB_URL is not set in environment variables.");
    }
    sequelize = new Sequelize(key, {
        logging: console.log, 
    });
}

export { sequelize };
