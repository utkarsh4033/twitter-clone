import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import users from './Users.js';

const posts = sequelize.define('posts', {
 posts_id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      }, 
  posts_content: { 
    type: DataTypes.TEXT,
    allowNull: false,
  },
  posts_photo_url: { 
    type: DataTypes.TEXT,
    allowNull: true,
  },
  posts_user_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users,
      key: 'users_id',
    },

  },
    posts_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    posts_updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    disabled: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }, 
}, {
  timestamps: false,
});

users.hasMany(posts, { foreignKey: 'posts_user_id' });
posts.belongsTo(users, { foreignKey: 'posts_user_id' });

export default posts;