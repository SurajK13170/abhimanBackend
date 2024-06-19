const { sequelize, DataTypes } = require('../db');
Connection = require('./Connection.model');
const User = sequelize.define('User', {
  userId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  availCoins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deviceId:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('prime', 'non-prime'),
    defaultValue: 'non-prime',
},
}, {
  timestamps: false,
});
Connection.associate = (models) => {
  Connection.belongsTo(models.User, { foreignKey: 'sender', as: 'Sender' });
  Connection.belongsTo(models.User, { foreignKey: 'receiver', as: 'Receiver' });
};
User.belongsToMany(User, {
  as: 'connections',
  through: 'Connection',
  foreignKey: 'sender',
  otherKey: 'receiver'
});

module.exports = { User };
