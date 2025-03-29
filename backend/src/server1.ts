import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import connectDB from './config/db';

// Import routes
import eventRoutes from './routes/eventRoutes';
import adminEventRoutes from './routes/vms-6';
import userEventRoutes from './routes/vms7';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// Using the first codebase's connection method but exposing the db object for event listeners
const db = connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', eventRoutes); // From first codebase
app.use('/api/admin/events', adminEventRoutes); // From second codebase
app.use('/api/users/events', userEventRoutes); // From second codebase

// Basic route for API health check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Unified Event Management API is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack || err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Handle 404 routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to database and start server
db.then(() => {
  console.log(`MongoDB Connected, Starting Server...`);
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch((err: Error) => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1); // Exit process on connection error
});

export default app;