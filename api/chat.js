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
      const { userId, limit } = req.query || {};
      const query = {};
      if (userId) query.userId = userId;
      const lim = Math.min(parseInt(limit || '50', 10) || 50, 200);
      const history = await chats
        .find(query)
        .sort({ timestamp: -1 })
        .limit(lim)
        .toArray();
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
