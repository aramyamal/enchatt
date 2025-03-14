import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';
import { messagesModel } from './messages.db';

export class ChatsModel extends Model<InferAttributes<ChatsModel>, InferCreationAttributes<ChatsModel>> {
    declare key: string;
    declare salt : string
}

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

ChatsModel.hasMany(messagesModel, { foreignKey: 'chatKey' });
messagesModel.belongsTo(ChatsModel, { foreignKey: 'chatKey' });