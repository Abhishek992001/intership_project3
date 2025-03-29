import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getPendingUsers,
  updateUserStatus,
  getVolunteerDirectory,
} from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, admin, getUsers);

router.get('/pending', protect, admin, getPendingUsers);
router.get('/volunteers', protect, getVolunteerDirectory);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route('/:id/status')
  .put(protect, admin, updateUserStatus);

export default router;