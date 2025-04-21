// Load environment variables (for local development)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*' },
});

// Database connection
require('./db'); // your db.js handles mongoose.connect

// Import routes
const roomsRoute      = require('./routes/roomsRoute');
const usersRoute      = require('./routes/usersRoute');
const bookingsRoute   = require('./routes/bookingsRoute');
const paymentRoute    = require('./routes/paymentRoutes');
const esewaRoutes     = require('./routes/esewaRoutes');
const stripeRoute     = require('./routes/stripeRoute');
const kycRoute        = require('./routes/kycRoute');
const chatRoutes      = require('./routes/chatRoutes');
const reviewRoutes    = require('./routes/reviewRoutes');

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/rooms',    roomsRoute);
app.use('/api/users',    usersRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/esewa',    esewaRoutes);
app.use('/api/stripe',   stripeRoute);
app.use('/api/kyc',      kycRoute);
app.use('/api/chat',     chatRoutes);
app.use('/api/reviews',  reviewRoutes);

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'client', 'build');
  app.use(express.static(buildPath));

  // All other GET requests not handled before should return React's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Socket.IO real-time chat
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', (data) => {
    io.emit(`receiveMessage-${data.roomid}-${data.receiverId}`, data);
    io.emit(`receiveMessage-${data.roomid}-${data.senderId}`, data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
