import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';
import { ChatsModel } from './chats.db';

/**
 * represents a message
 * 
 * this model is mapped to the Messages table in the database
 */
export class messagesModel extends Model<InferAttributes<messagesModel>, InferCreationAttributes<messagesModel>> {
    declare id: CreationOptional<number>;
    declare chatKey : string;
    declare sender : string;
    declare content : string;
    public createdAt!: CreationOptional<Date>;
    declare iv: string
}

/**
 * initializes the messagesModel schema with Sequelize
 * 
 * id: primary key which is auto incremented
 * chatKey: foreign key linking to `ChatsModel.key`
 * sender: sender identifier
 * content: message content
 * createdAt: timestamp of message
 * iv: initialization vector for encryption
 */
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
            type : DataTypes.STRING
        },
        content: {
            type : DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        iv : {
            type : DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: 'Messages',
        tableName: 'Messages'
    }
);
