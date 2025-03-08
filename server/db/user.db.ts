import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';

export class userModel extends Model<InferAttributes<userModel>, InferCreationAttributes<userModel>> {
    declare id : number;
    declare username : string;
}

userModel.init(
    {
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        username : {
            type : DataTypes.STRING,
            unique: true
        }
    },
    {
        sequelize,
        modelName: 'Users'
    }
)
