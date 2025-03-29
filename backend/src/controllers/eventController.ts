// backend/src/controllers/eventController.ts
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel';
import User from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';
import { EventStatus } from '../types/event';
import mongoose from 'mongoose';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    location,
    startDate,
    endDate,
    status,
    maxVolunteers,
    skills,
  } = req.body;

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const event = await Event.create({
    title,
    description,
    location,
    startDate,
    endDate,
    status: status || EventStatus.UPCOMING,
    maxVolunteers,
    skills: skills || [],
    createdBy: req.user._id,
    registeredVolunteers: [],
  });

  if (event) {
    res.status(201).json(event);
  } else {
    res.status(400);
    throw new Error('Invalid event data');
  }
});

// @desc    Get all events
// @route   GET /api/events
// @access  Private
export const getEvents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const events = await Event.find({}).sort({ startDate: 1 });
  res.json(events);
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
export const getEventById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const event = await Event.findById(req.params.id)
    .populate('registeredVolunteers', 'name email');

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    location,
    startDate,
    endDate,
    status,
    maxVolunteers,
    skills,
  } = req.body;

  const event = await Event.findById(req.params.id);

  if (event) {
    event.title = title || event.title;
    event.description = description || event.description;
    event.location = location || event.location;
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;
    event.status = status || event.status;
    event.maxVolunteers = maxVolunteers || event.maxVolunteers;
    event.skills = skills || event.skills;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Register volunteer for event
// @route   POST /api/events/:id/register
// @access  Private/Volunteer
export const registerForEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const event = await Event.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!event || !user) {
    res.status(404);
    throw new Error('Event or user not found');
  }

  // Check if event has reached maximum volunteers
  if (event.maxVolunteers && (event.registeredVolunteers?.length || 0) >= event.maxVolunteers) {
    res.status(400);
    throw new Error('Event has reached maximum number of volunteers');
  }

  // Check if user is already registered for this event
  const isRegistered = event.registeredVolunteers?.some(
    (volunteerId) => volunteerId.toString() === req.user._id.toString()
  ) || false;

  if (isRegistered) {
    res.status(400);
    throw new Error('You are already registered for this event');
  }

  // Add user to event's registered volunteers
  if (!event.registeredVolunteers) {
    event.registeredVolunteers = [];
  }
  event.registeredVolunteers.push(new mongoose.Types.ObjectId(req.user._id));
  await event.save();

  // Add event to user's registered events
  if (!user.registeredEvents) {
    user.registeredEvents = [];
  }
  user.registeredEvents.push(new mongoose.Types.ObjectId(event.id));
  await user.save();

  res.status(201).json({ message: 'Successfully registered for event' });
});

// @desc    Unregister volunteer from event
// @route   POST /api/events/:id/unregister
// @access  Private/Volunteer
export const unregisterFromEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const event = await Event.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!event || !user) {
    res.status(404);
    throw new Error('Event or user not found');
  }

  // Check if user is registered for this event
  const isRegistered = event.registeredVolunteers?.some(
    (volunteerId) => volunteerId.toString() === req.user._id.toString()
  ) || false;

  if (!isRegistered) {
    res.status(400);
    throw new Error('You are not registered for this event');
  }

  // Remove user from event's registered volunteers
  if (event.registeredVolunteers) {
    event.registeredVolunteers = event.registeredVolunteers.filter(
      (volunteerId) => volunteerId.toString() !== req.user._id.toString()
    );
  }
  await event.save();

  // Remove event from user's registered events
  if (user.registeredEvents) {
    user.registeredEvents = user.registeredEvents.filter(
      (eventId) => eventId.toString() !== event.id.toString()
    );
  }
  await user.save();

  res.status(200).json({ message: 'Successfully unregistered from event' });
});