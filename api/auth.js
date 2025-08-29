const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { action, username, password, guestName, guestPhone } = req.body;
    
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db('solar-chat');
      const users = db.collection('users');
      
      if (action === 'login') {
        // Admin login
        const user = await users.findOne({ username, role: 'admin' });
        
        if (!user) {
          return res.status(401).json({ error: 'Tài khoản không tồn tại' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Mật khẩu không đúng' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.status(200).json({
          success: true,
          token,
          user: {
            id: user._id,
            username: user.username,
            role: user.role,
            name: user.name
          }
        });
        
      } else if (action === 'guest') {
        // Guest login
        const guestInfo = {
          name: guestName,
          phone: guestPhone,
          role: 'guest',
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        // Check if guest already exists
        const existingGuest = await users.findOne({ 
          phone: guestPhone, 
          role: 'guest' 
        });
        
        if (existingGuest) {
          // Update last login
          await users.updateOne(
            { _id: existingGuest._id },
            { $set: { lastLogin: new Date() } }
          );
          
          const token = jwt.sign(
            { userId: existingGuest._id, phone: existingGuest.phone, role: 'guest' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          
          return res.status(200).json({
            success: true,
            token,
            user: {
              id: existingGuest._id,
              name: existingGuest.name,
              phone: existingGuest.phone,
              role: 'guest'
            }
          });
        }
        
        // Create new guest user
        const result = await users.insertOne(guestInfo);
        
        const token = jwt.sign(
          { userId: result.insertedId, phone: guestPhone, role: 'guest' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        res.status(200).json({
          success: true,
          token,
          user: {
            id: result.insertedId,
            name: guestName,
            phone: guestPhone,
            role: 'guest'
          }
        });
        
      } else if (action === 'register') {
        // Admin registration (only for first time setup)
        const adminCount = await users.countDocuments({ role: 'admin' });
        
        if (adminCount > 0) {
          return res.status(403).json({ error: 'Admin đã tồn tại' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const adminUser = {
          username,
          password: hashedPassword,
          name: username,
          role: 'admin',
          createdAt: new Date(),
          permissions: ['chat_management', 'user_management', 'system_admin']
        };
        
        const result = await users.insertOne(adminUser);
        
        res.status(201).json({
          success: true,
          message: 'Admin đã được tạo thành công'
        });
        
      } else {
        res.status(400).json({ error: 'Action không hợp lệ' });
      }
      
    } catch (err) {
      console.error('Auth error:', err);
      res.status(500).json({ error: 'Lỗi server' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method không được hỗ trợ' });
  }
};
