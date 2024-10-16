const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const jwt = require('jsonwebtoken'); 
const fileRoutes = require('./routes/fileRoutes');
const app = express();
const socketIo=require('socket.io');
const taskRoutes=require('./routes/taskRoutes');
const http = require('http');

connectDB();

app.use(express.json());


const server = http.createServer(app);
const io = socketIo(server);
app.io = io;


const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user; 
        next();
    });
};

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Protected content', user: req.user });
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
