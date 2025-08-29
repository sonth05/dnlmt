const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || 
                req.cookies?.token || 
                req.query?.token;

  if (!token) {
    return res.status(401).json({ error: 'Token không được cung cấp' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

// Check if user has specific role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Yêu cầu đăng nhập' });
    }
    
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    
    next();
  };
}

// Check if user has specific permission
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Yêu cầu đăng nhập' });
    }
    
    if (req.user.role === 'admin') {
      return next(); // Admin has all permissions
    }
    
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
    }
    
    next();
  };
}

// Optional authentication (user can be guest or admin)
function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || 
                req.cookies?.token || 
                req.query?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token invalid, but continue as guest
      req.user = null;
    }
  }
  
  next();
}

module.exports = {
  verifyToken,
  requireRole,
  requirePermission,
  optionalAuth
};
