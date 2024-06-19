const { sequelize, DataTypes } = require('../db');
const {User} = require("./User.model")
const {ChatRoom} = require("./ChatRoom.model")

const Message = sequelize.define('Message', {

  message: DataTypes.STRING,
},{
  timestamps:false,
});

Message.belongsTo(ChatRoom)
Message.belongsTo(User);


module.exports = {Message};
