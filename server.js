require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(cors({ origin: '*' }));

// Security Guard: Prevent public access to sensitive files
app.use((req, res, next) => {
    const forbidden = ['.env', 'package.json', 'package-lock.json', 'server.js', 'node_modules'];
    const requestPath = req.path.toLowerCase();
    if (forbidden.some(f => requestPath.includes(f))) {
        return res.status(403).json({ message: 'Access Denied' });
    }
    next();
});

// Connect to MongoDB with robust error handling (does not crash if DB is offline)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/admin';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => {
        console.warn('MongoDB connection failed. Continuing in in-memory / local storage mode:', err.message);
    });

// User Model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// JWT Middleware
const JWT_SECRET = process.env.JWT_SECRET || 'monopoly_secure_jwt_secret_key_2025';

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// Auth Routes
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, userId: user._id, username: user.username });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Transaction Model
const transactionSchema = new mongoose.Schema({
    history: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/transactions', authenticate, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/transactions', authenticate, async (req, res) => {
    const { history } = req.body;
    if (!history) {
        return res.status(400).json({ message: 'History description is required' });
    }

    try {
        const newTransaction = new Transaction({ 
            history,
            userId: req.user.id 
        });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// REAL-TIME MULTIPLAYER SYSTEM (Socket.io)
// -------------------------------------------------------------
// In-memory Room State Registry
const rooms = new Map();

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return rooms.has(code) ? generateRoomCode() : code;
}

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Create a new multiplayer room
    socket.on('create-room', ({ hostName, initialGameState }, callback) => {
        try {
            const roomCode = generateRoomCode();
            socket.join(roomCode);

            const roomData = {
                roomCode,
                hostSocketId: socket.id,
                hostName: hostName || 'Banker',
                gameState: initialGameState || null,
                members: [{ socketId: socket.id, name: hostName || 'Banker', isHost: true }]
            };

            rooms.set(roomCode, roomData);
            socket.roomCode = roomCode;

            console.log(`Room created: ${roomCode} by ${hostName || 'Banker'}`);
            if (callback) callback({ success: true, roomCode, roomData });
        } catch (err) {
            if (callback) callback({ success: false, error: err.message });
        }
    });

    // Join an existing room
    socket.on('join-room', ({ roomCode, playerName }, callback) => {
        try {
            const upperCode = (roomCode || '').trim().toUpperCase();
            const room = rooms.get(upperCode);

            if (!room) {
                if (callback) callback({ success: false, error: 'Room not found! Check the room code.' });
                return;
            }

            socket.join(upperCode);
            socket.roomCode = upperCode;

            // Check if player already exists in members list
            let member = room.members.find(m => m.name.toLowerCase() === (playerName || '').toLowerCase());
            if (!member) {
                member = { socketId: socket.id, name: playerName, isHost: false };
                room.members.push(member);
            } else {
                member.socketId = socket.id; // Reconnect socket
            }

            console.log(`Player ${playerName} joined room ${upperCode}`);

            // Notify everyone in the room
            io.to(upperCode).emit('player-joined', {
                player: member,
                members: room.members,
                gameState: room.gameState
            });

            if (callback) {
                callback({ 
                    success: true, 
                    roomCode: upperCode, 
                    gameState: room.gameState, 
                    isHost: room.hostSocketId === socket.id 
                });
            }
        } catch (err) {
            if (callback) callback({ success: false, error: err.message });
        }
    });

    // Sync game state across all clients in the room
    socket.on('sync-game-state', ({ roomCode, gameState, actionLog }) => {
        const upperCode = (roomCode || socket.roomCode || '').toUpperCase();
        const room = rooms.get(upperCode);
        if (room) {
            room.gameState = gameState;
            // Broadcast the updated game state to all other sockets in the room
            socket.to(upperCode).emit('state-updated', {
                gameState,
                actionLog,
                senderSocketId: socket.id
            });
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        if (socket.roomCode) {
            const room = rooms.get(socket.roomCode);
            if (room) {
                room.members = room.members.filter(m => m.socketId !== socket.id);
                io.to(socket.roomCode).emit('player-left', {
                    socketId: socket.id,
                    members: room.members
                });
                // If room empty, clean up after 1 hour
                if (room.members.length === 0) {
                    setTimeout(() => {
                        if (rooms.get(socket.roomCode)?.members.length === 0) {
                            rooms.delete(socket.roomCode);
                            console.log(`Cleaned up empty room ${socket.roomCode}`);
                        }
                    }, 3600000);
                }
            }
        }
    });
});

// Serve static assets from current directory (keeping backward compatibility with existing links)
app.use(express.static(__dirname));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve rules.html
app.get('/rules', (req, res) => {
    res.sendFile(path.join(__dirname, 'rules.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`Monopoly Bank Server running on port ${PORT}`);
    console.log(`Multiplayer WebSocket support: ACTIVE`);
    console.log(`http://localhost:${PORT}`);
    console.log(`=========================================`);
});
