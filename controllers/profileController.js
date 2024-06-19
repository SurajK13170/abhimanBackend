const { ChatRoom } = require("../models/ChatRoom.model");
const { User } = require("../models/User.model");
const { UserRoom } = require("../models/UserRoom.model");
const { Message } = require("../models/Message.model");
const { Connection } = require("../models/Connection.model");


exports.getprofile = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'phone', 'availCoins', 'role', 'deviceId'],
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

exports.getprofiles = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['userId', 'name', 'phone', 'availCoins', 'role', 'deviceId'],
    })
    if (!users) {
      return res.status(404).json({ error: 'Users not found' });
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve profiles' });
  }
};

exports.postRequest = async (req, res) => {
  try {
   const users = await Connection.create({
      sender: req.body.userId,
      receiver: req.params.userId,
    })

    res.status(200).json({ users, message: 'Request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send request' });
  }
}


exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Connection.findAll({
      attributes: ['id', 'sender', 'receiver', 'status'],
      include: [
        { model: User, as: 'sender', attributes: ['userId', 'name'] },
        { model: User, as: 'receiver', attributes: ['userId', 'name'] },
      ],
    });

    res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve friend requests' });
  }
};