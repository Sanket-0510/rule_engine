import sequelize from "../conn.js";
import { Model, DataTypes } from "sequelize";
class Rule extends Model {}

Rule.init(
  {
    //primary key for the table
    rule_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    //foreign key for the table this will reference the user table
    user_id: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false,
    },

    //name of the rule
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // will have a short description of the rule
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // this will be the actual rule converted to json from AST.
    Json: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Rule",
    tableName: 'Rules'
  }
);

export default Rule;