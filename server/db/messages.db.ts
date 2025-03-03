import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';
import { userModel } from './user.db';
import { ChatsModel } from './chats.db';

export class messagesModel extends Model<InferAttributes<messagesModel>, InferCreationAttributes<messagesModel>> {
    declare id: CreationOptional<number>;
    declare chatKey : string;
    declare sender : string;
    declare time : Date;
    declare content : string;
    declare key: "Key 1" | "Key 2" | "Key 3" | "Key 4";
}

messagesModel.init(
    {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        chatKey : {
            type : DataTypes.STRING,
            references : {
                model : ChatsModel,
                key : 'key'
            }
        },
        sender :{
            type : DataTypes.STRING,
            references: {
                model : userModel,
                key : 'username'
            }
        },
        time : {
            type : DataTypes.DATE
        },
        content: {
            type : DataTypes.STRING
        },
        key: {
            type : DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: 'Messages'
    }
);

ChatsModel.hasMany(messagesModel, { foreignKey: 'chatKey' });
messagesModel.belongsTo(ChatsModel, { foreignKey: 'chatKey' });

userModel.hasMany(messagesModel, { foreignKey: 'sender' });
messagesModel.belongsTo(userModel, { foreignKey: 'sender' });