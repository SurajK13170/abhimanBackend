const { sequelize, DataTypes } = require('../db');
const { User } = require('./User.model');

const ChatRoom = sequelize.define('ChatRoom', {
  roomName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  MaxCapacity: {
    type: DataTypes.INTEGER,
    defaultValue: 6,
    validate: {
      min: 1, // Ensure at least one participant can join
      max: 6, // Adjust max capacity as needed
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'userId',
    },
  },
}, {
  timestamps: false,
});

ChatRoom.belongsTo(User);
User.hasMany(ChatRoom);

module.exports = { ChatRoom };
