const { User } = require('../models/User.model');
const { ChatRoom } = require('../models/ChatRoom.model');
const { UserRoom } = require('../models/UserRoom.model');
const bcrypt = require('bcrypt');

exports.createChatRoom = async (req, res) => {
  try {
    const creatorId = req.body.userId; // Extract creatorId from auth middleware
    const { roomName, password } = req.body;
    // console.log(creatorId, "heloo0000000000")

    // Validate input
    if (!creatorId || !roomName || !password) {
      return res.status(400).json({ error: 'creatorId, roomName, and password are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the chat room
    const chatRoom = await ChatRoom.create({
      roomName,
      password: hashedPassword,
      creatorId
    });

    res.status(201).json({ message: 'Chat room created successfully', chatRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create chat room' });
  }
};


exports.joinRoom = async (req, res) => {
  try {
    const { userId } = req.body;
    const { roomId, password } = req.body;

    if (!roomId || !password) {
      return res.status(400).json({ error: 'roomId and password are required' });
    }

    const user = await User.findOne({ where: { userId, role: 'prime' } });
    if (!user) {
      return res.status(403).json({ error: 'Only prime members can join rooms' });
    }

    if (user.availCoins < 150) {
      return res.status(403).json({ error: 'Insufficient coins to join the room' });
    }

    const chatRoom = await ChatRoom.findByPk(roomId);
    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, chatRoom.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: 'Incorrect password' });
    }

    const userRoomExists = await UserRoom.findOne({ where: { userId, status: 'active' } });
    if (userRoomExists) {
      return res.status(403).json({ error: 'User is already in another room' });
    }
    const userRoom = await UserRoom.create({
      userId,
      roomId,
      joinTime: new Date(),
      status: 'active',
    });

    user.availCoins -= 150;
    await user.save();

    res.status(200).json({ message: 'Joined room successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to join room' });
  }
};


exports.leaveRoom = async (req, res) => {
  try {
    const { userId, roomId } = req.body;

    if (!userId || !roomId) {
      return res.status(400).json({ error: 'userId and roomId are required' });
    }

    const userRoom = await UserRoom.findOne({ where: { userId, roomId,status:"active"} });
    console.log(userRoom)

    if (!userRoom) {
      return res.status(404).json({ error: 'User is not in this room or already left' });
    }

    userRoom.status = 'inactive';
    userRoom.leaveTime = new Date();
    await userRoom.save();

    const user = await User.findByPk(userId);
    if (user && !user.isPrime) {
      user.availCoins += 150;
      await user.save();
    }

    res.status(200).json({ message: 'Left room successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to leave room' });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.findAll({
      attributes: ['id', 'roomName', 'creatorId'], // Select specific attributes
    });
    const chatRoomsWithJoinedStatus = await Promise.all(chatRooms.map(async (chatRoom) => {
      const userRoom = await UserRoom.findOne({
        where: { userId: req.body.userId, roomId: chatRoom.id, status: 'active' }
      });
      return {
        id: chatRoom.id,
        roomName: chatRoom.roomName,
        creatorId: chatRoom.creatorId,
        joined: !!userRoom
      };
    }));
    res.status(200).json(chatRoomsWithJoinedStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
};