const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { sequelize } = require('./db');
const authRoutes = require('./routes/authRoutes');
const chatRoomsRoutes = require('./routes/chatRoutes');
const profileRoutes = require('./routes/profileRoutes');
const messageRoute = require('./routes/messageRoutes')

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', ({ userId, roomId }) => {
    socket.join(roomId);
    io.to(roomId).emit('message', { user: 'admin', text: `${userId} has joined!` });
  });

  socket.on('sendMessage', (message, roomId, callback) => {
    io.to(roomId).emit('message', { user: message.userId, text: message.text });
    callback();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/users', authRoutes);
app.use('/api/chatrooms', chatRoomsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoute);


// Start server

sequelize.sync().then(()=>{
  console.log('Tabel Created')
  app.listen(port,()=>{
      console.log('Server is runnig at Port No. 3000')
  })
})
