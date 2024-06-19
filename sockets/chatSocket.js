const { Server } = require('socket.io');
const { Message } = require('../models/Message.model');
const { UserRoom } = require('../models/UserRoom.model');

let io;

const setupSocketIO = (server) => {
  // Initialize the Socket.io server
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Replace with your frontend's URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining a room
    socket.on('joinRoom', async ({ userId, roomId }) => {
      try {
        // Add the user to the Socket.io room
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);

        // Update UserRoom status to 'active'
        await UserRoom.update({ status: 'active' }, {
          where: { userId, roomId }
        });

        // Notify other users in the room
        socket.to(roomId).emit('userJoined', { userId });
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    // Handle user sending a message
    socket.on('sendMessage', async ({ roomId, userId, content }) => {
      try {
        // Create and save the message in the database
        const message = await Message.create({
          roomId,
          userId,
          content
        });

        // Emit the message to the room
        io.to(roomId).emit('message', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle user leaving a room
    socket.on('leaveRoom', async ({ userId, roomId }) => {
      try {
        // Remove the user from the Socket.io room
        socket.leave(roomId);
        console.log(`User ${userId} left room ${roomId}`);

        // Update UserRoom status to 'inactive'
        await UserRoom.update({ status: 'inactive' }, {
          where: { userId, roomId }
        });

        // Notify other users in the room
        socket.to(roomId).emit('userLeft', { userId });
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

// Function to get the Socket.io instance
const getIO = () => io;

module.exports = { setupSocketIO, getIO };
