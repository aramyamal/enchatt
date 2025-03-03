import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';
import { userModel } from './user.db';

export class messagesModel extends Model<InferAttributes<messagesModel>, InferCreationAttributes<messagesModel>> {
    declare id : number;
    declare sender : string;
    declare time : Date;
    declare content : string;
    declare key: "Key 1" | "Key 2" | "Key 3" | "Key 4";
}

messagesModel.init(
    {
        id : {
            type : DataTypes.NUMBER,
            autoIncrement: true,
            primaryKey : true
        },
        sender :{
            type : DataTypes.STRING,
            references: {
                model : userModel,
                key : 'id'
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