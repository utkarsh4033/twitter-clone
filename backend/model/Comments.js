import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import posts from './Posts.js';
import users from './Users.js';

const comments = sequelize.define('comments', {
  comments_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comments_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  comments_posts_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: posts,
      key: 'posts_id',
    },
  },
  comments_users_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users,
      key: 'users_id',
    },
  },
  comments_created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  comments_updated_at: {
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

posts.hasMany(comments, { foreignKey: 'comments_posts_id' });
users.hasMany(comments, { foreignKey: 'comments_users_id' });
comments.belongsTo(posts, { foreignKey: 'comments_posts_id' });
comments.belongsTo(users, { foreignKey: 'comments_users_id' });

export default comments;
