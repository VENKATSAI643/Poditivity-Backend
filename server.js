const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const jwt = require('jsonwebtoken'); 
const fileRoutes = require('./routes/fileRoutes');
const app = express();
const taskRoutes=require('./routes/taskRoutes');
const WebSocket = require('ws');


connectDB();

app.use(express.json());


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

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.send('Welcome to the WebSocket server!');
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Server received: ${message}`);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
    
    console.log('WebSocket server is running on ws://localhost:8080');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
