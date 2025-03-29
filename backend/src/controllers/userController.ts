// backend/src/controllers/userController.ts
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserStatus } from '../types/user';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get pending users
// @route   GET /api/users/pending
// @access  Private/Admin
export const getPendingUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const users = await User.find({ status: UserStatus.PENDING }).select('-password');
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.status = req.body.status || user.status;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.location = req.body.location || user.location;
    user.skills = req.body.skills || user.skills;

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
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Approve or reject user
// @route   PUT /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  if (!status || !Object.values(UserStatus).includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const user = await User.findById(req.params.id);

  if (user) {
    user.status = status;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      status: updatedUser.status,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get volunteer directory (basic info of volunteers)
// @route   GET /api/users/volunteers
// @access  Private
export const getVolunteerDirectory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const volunteers = await User.find({ 
    status: UserStatus.APPROVED 
  }).select('name bloodGroup location');
  
  res.json(volunteers);
});