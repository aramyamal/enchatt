import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';
import { messagesModel } from './messages.db';

/**
 * represents a chat
 * 
 * this model is mapped to the "Chats" table in the database
 */
export class ChatsModel extends Model<InferAttributes<ChatsModel>, InferCreationAttributes<ChatsModel>> {
    declare key: string;
    declare salt : string
}

/**
 * initializes the "ChatsModel" schema with Sequelize
 * 
 * key: primary key for each chat
 * salt: used for encryption
 */
ChatsModel.init(
    {
        key: {
            type : DataTypes.STRING,
            primaryKey : true
        },
        salt : {
            type : DataTypes.STRING,
            allowNull: true
        }
    },
        {
        sequelize,
        modelName: 'Chats'
    }
);

/**
 * establishes a one-to-many relationship between ChatsModel and messagesModel.
 */
ChatsModel.hasMany(messagesModel, { foreignKey: 'chatKey' });
messagesModel.belongsTo(ChatsModel, { foreignKey: 'chatKey' });