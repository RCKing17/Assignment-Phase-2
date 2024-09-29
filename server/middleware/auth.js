// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'your_jwt_secret_key';

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) return res.status(403).json({ message: 'Token is required' });

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ message: 'Unauthorized access' });
//     req.user = decoded;  // The token payload contains user ID and role
//     next();
//   });
// };

// // Middleware to check if the user has the required role
// const checkRole = (roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return res.status(403).json({ message: 'Access denied' });
//   }
//   next();
// };

// module.exports = {
//   verifyToken,
//   checkRole
// };

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];  // Extract token from "Bearer <token>"

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    // Store the decoded user data (from token) in the request object
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
