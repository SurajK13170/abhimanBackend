const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User.model');
require('dotenv').config();


exports.register = async (req, res) => {
    try {
      const { deviceId, name, phone, password,role,availCoins } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Increased bcrypt rounds for stronger hashing
  
      const user = await User.create({
        deviceId,
        name,
        phone,
        password: hashedPassword,
        role,
        availCoins
      });
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  };

exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ where: { name } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log(user)
        const token = jwt.sign({ userId: user.userId }, "process.env.JWT_SECRET", { expiresIn: '1h' });
        res.json({ token, userId:user.userId});
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};
