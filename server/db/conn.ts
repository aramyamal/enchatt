import { Sequelize } from 'sequelize';

const dotenv = require("dotenv");
// ensure environment variables are loaded
dotenv.config(); 

/**
 * Sequelize instance for database connection
 * 
 * @type {Sequelize}
 */
let sequelize: Sequelize;

// config for testing
if (process.env.NODE_ENV === "test") {
    /**
     * initializes an in-memory SQLite database for testing
     */
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:'
    }); 
} 
// config for production
else {
    const key = process.env.DB_URL;
    
    if (!key) {
        throw new Error("DB_URL is not set in environment variables.");
    }

    /**
     * initializes a production database
     */
    sequelize = new Sequelize(key, {
        logging: console.log, 
    });
}

export { sequelize };
