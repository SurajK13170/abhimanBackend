const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../Middleware/auth');

const { createMessage, getMessagesByRoomId, deleteMessage } = require('../controllers/messageController');

// POST - Create a new message
router.post('/',authenticateToken, createMessage);

// GET - Get messages by roomId
router.get('/:roomId',authenticateToken, getMessagesByRoomId);

// DELETE - Delete a message by messageId
router.delete('/:messageId',authenticateToken, deleteMessage);

module.exports = router;
