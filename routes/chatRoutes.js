const { authenticateToken } = require('../Middleware/auth');
const { authorizeRoles } = require('../Middleware/authorization');
const express = require('express')
const {createChatRoom, joinRoom, leaveRoom, getAllRooms} = require("../controllers/chatController")
const router = express.Router();

router.post('/create',authenticateToken, createChatRoom);
router.post('/joinRoom',authenticateToken, joinRoom);
router.post('/leave',authenticateToken, leaveRoom)
router.get('/',authenticateToken, getAllRooms)



module.exports = router;