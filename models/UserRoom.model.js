const { sequelize, DataTypes } = require('../db');
const { User } = require('./User.model');
const { ChatRoom } = require('./ChatRoom.model');

const UserRoom = sequelize.define('UserRoom', {
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'userId',
    },
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ChatRoom,
      key: 'id',
    },
  },
  joinTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  timestamps: false,
});

UserRoom.belongsTo(User);
UserRoom.belongsTo(ChatRoom);
UserRoom

module.exports = {UserRoom};
