import { Sequelize } from 'sequelize';
export const sequelize = new Sequelize('postgres://postgres:4514@localhost:5432/enchatt_db', {
    logging: console.log, 
});



