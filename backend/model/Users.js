import { DataTypes } from "sequelize";
import sequelize from './index.js';

const users = sequelize.define(
  "users",
  {
      users_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    users_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    users_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    users_password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    users_role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    users_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    users_updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    disabled: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  },
  {
    timestamps: false,

  }
);
export default users