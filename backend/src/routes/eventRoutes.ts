import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} from '../controllers/eventController';
import { protect, admin, volunteer } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, admin, createEvent)
  .get(protect, getEvents);

router.route('/:id')
  .get(protect, getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

router.route('/:id/register')
  .post(protect, volunteer, registerForEvent);

router.route('/:id/unregister')
  .post(protect, volunteer, unregisterFromEvent);

export default router;