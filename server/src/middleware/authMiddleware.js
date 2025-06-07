// server/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Assuming your user model is named 'User'

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token); // Add this


      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token payload:', decoded); // Add this


      // Attach user from the token payload to the request object (excluding password)
      // This allows subsequent middleware/controllers to access req.user
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Optional: Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) { // Assuming your User model has an 'isAdmin' field
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };