import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';
import { userModel } from './user.db';
import { ChatsModel } from './chats.db';

export class messagesModel extends Model<InferAttributes<messagesModel>, InferCreationAttributes<messagesModel>> {
    declare id: CreationOptional<number>;
    declare chatKey : string;
    declare sender : string;
    declare content : string;
    public createdAt!: CreationOptional<Date>;
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
        },
        content: {
            type : DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        key: {
            type : DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: 'Messages',
        tableName: 'Messages'
    }
);
