const { Message } = require('../models/Message.model');
const { User } = require('../models/User.model');
const { ChatRoom } = require('../models/ChatRoom.model');

exports.createMessage = async (req, res) => {
  try {
    const {roomId} = req.params
    const {userId, message } = req.body;
    console.log(userId, roomId, message)

    if (!userId || !roomId || !message) {
      return res.status(400).json({ error: 'userId, roomId, and content are required' });
    }

    const user = await User.findByPk(userId);
    const chatRoom = await ChatRoom.findByPk(roomId);
    if (!user || !chatRoom) {
      return res.status(404).json({ error: 'User or chat room not found' });
    }

    const messages = await Message.create({
      message,
      UserId: userId,
      ChatRoomId: roomId,
    });

    res.status(201).json({ message: 'Message created successfully', messages });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
};

exports.getMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ error: 'roomId parameter is required' });
    }

    const messages = await Message.findAll({
      where: { ChatRoomId: roomId },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ error: 'messageId parameter is required' });
    }

    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await message.destroy();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
