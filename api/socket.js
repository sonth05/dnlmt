const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
let io;

module.exports = async (req, res) => {
  if (!io) {
    io = new Server(req.socket.server, { path: '/api/socket' });
    
    io.on('connection', async (socket) => {
      const client = new MongoClient(MONGODB_URI);
      
      try {
        await client.connect();
        const db = client.db('solar-chat');
        const chats = db.collection('chats');

        socket.on('client-message', async (msg) => {
          const chat = {
            userId: socket.id,
            message: msg,
            timestamp: new Date(),
            type: 'client'
          };
          
          await chats.insertOne(chat);
          io.emit('new-message', chat);
        });

        socket.on('admin-reply', async (data) => {
          const reply = {
            userId: data.userId,
            message: data.message,
            timestamp: new Date(),
            type: 'admin'
          };
          
          await chats.insertOne(reply);
          io.to(data.userId).emit('server-message', reply);
        });

      } catch (err) {
        console.error('Database connection error:', err);
      }
    });
  }
  
  res.end();
};
