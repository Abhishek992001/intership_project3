// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';
import { UserRole, UserStatus } from '../types/user';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phoneNumber, bloodGroup, location, skills } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    bloodGroup,
    location,
    skills: skills || [],
    role: UserRole.VOLUNTEER,
    status: UserStatus.PENDING, // New users need admin approval
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      message: 'Registration successful! Your account is pending approval.',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    // Check if user is approved
    if (user.status !== UserStatus.APPROVED) {
      res.status(403);
      throw new Error('Your account is pending approval');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id.toString()),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phoneNumber: user.phoneNumber,
      bloodGroup: user.bloodGroup,
      location: user.location,
      skills: user.skills,
      registeredEvents: user.registeredEvents,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.location = req.body.location || user.location;
    user.skills = req.body.skills || user.skills;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      phoneNumber: updatedUser.phoneNumber,
      bloodGroup: updatedUser.bloodGroup,
      location: updatedUser.location,
      skills: updatedUser.skills,
      token: generateToken(updatedUser.id.toString()),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});