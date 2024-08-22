// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Create an instance of Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve the React app on the root route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// WebSocket connection setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages or events here
  socket.on('message', (message) => {
    console.log('Message received:', message);
    // Broadcast message to other connected clients
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
