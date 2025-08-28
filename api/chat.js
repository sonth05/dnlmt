const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // Get chat history
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db('solar-chat');
      const chats = db.collection('chats');
      
      const history = await chats.find().sort({ timestamp: -1 }).limit(50).toArray();
      res.status(200).json(history);
      
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
