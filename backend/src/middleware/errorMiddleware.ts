import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import { UserRole, UserStatus } from '../types/user';

// Extended interface for Request with user data
export interface AuthRequest extends Request {
  user?: any;
}

// Middleware to verify JWT token
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log(token);

      // Verify token
      const secret = process.env.JWT_SECRET as string;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const decoded = jwt.verify(token, secret) as { id: string };

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // TEMPORARILY COMMENTED OUT FOR DEVELOPMENT
      // Check if the user is approved
      // if (req.user.status !== UserStatus.APPROVED) {
      //   res.status(403);
      //   throw new Error('Your account is pending approval');
      // }

      next();
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

// Middleware to verify user is admin
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === UserRole.ADMIN) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

// Middleware to verify user is a volunteer
export const volunteer = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === UserRole.VOLUNTEER) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a volunteer');
  }
};