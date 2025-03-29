// backend/src/utils/seedData.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel';
import Event from '../models/eventModel';
import { UserRole, UserStatus } from '../types/user';
import { EventStatus } from '../types/event';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    status: UserStatus.APPROVED,
    phoneNumber: '1234567890',
    bloodGroup: 'O+',
    location: 'Ernakulam',
    skills: ['Management', 'Training'],
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    role: UserRole.VOLUNTEER,
    status: UserStatus.APPROVED,
    phoneNumber: '1234567891',
    bloodGroup: 'A+',
    location: 'Chennai',
    skills: ['Teaching', 'First Aid'],
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    role: UserRole.VOLUNTEER,
    status: UserStatus.APPROVED,
    phoneNumber: '1234567892',
    bloodGroup: 'B-',
    location: 'Trivandrum',
    skills: ['Cooking', 'Counseling'],
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'bob123',
    role: UserRole.VOLUNTEER,
    status: UserStatus.APPROVED,
    phoneNumber: '1234567893',
    bloodGroup: 'AB+',
    location: 'Ernakulam',
    skills: ['Driving', 'Photography'],
  },
  {
    name: 'Alice Williams',
    email: 'alice@example.com',
    password: 'alice123',
    role: UserRole.VOLUNTEER,
    status: UserStatus.APPROVED,
    phoneNumber: '1234567894',
    bloodGroup: 'O-',
    location: 'Chennai',
    skills: ['Medical', 'Language Translation'],
  },
];

// Sample events data
const createSampleEvents = (adminId: string) => [
  {
    title: 'Beach Cleanup Drive',
    description: 'Help clean up the local beach and protect marine life',
    location: 'Marina Beach, Chennai',
    startDate: new Date('2025-04-15T09:00:00'),
    endDate: new Date('2025-04-15T13:00:00'),
    status: EventStatus.UPCOMING,
    maxVolunteers: 20,
    skills: ['Environment', 'Physical work'],
    createdBy: adminId,
  },
  {
    title: 'Food Distribution',
    description: 'Distribute food packages to homeless shelters',
    location: 'MG Road, Ernakulam',
    startDate: new Date('2025-04-20T10:00:00'),
    endDate: new Date('2025-04-20T16:00:00'),
    status: EventStatus.UPCOMING,
    maxVolunteers: 15,
    skills: ['Cooking', 'Driving'],
    createdBy: adminId,
  },
  {
    title: 'Tree Planting Initiative',
    description: 'Join us in planting trees around the city',
    location: 'Kowdiar Park, Trivandrum',
    startDate: new Date('2025-05-01T08:00:00'),
    endDate: new Date('2025-05-01T14:00:00'),
    status: EventStatus.UPCOMING,
    maxVolunteers: 25,
    skills: ['Gardening', 'Physical work'],
    createdBy: adminId,
  },
];

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI as string;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

// Import data
const importData = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    
    console.log('Data cleared...');

    // Hash passwords manually for seed data
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`${createdUsers.length} users created`);
    
    // Get admin user ID
    //const adminUser = createdUsers[0]._id;
    const adminUser = createdUsers[0].id.toString();

    
    // Create events with admin ID
    const sampleEvents = createSampleEvents(adminUser);
    await Event.insertMany(sampleEvents);
    
    console.log(`${sampleEvents.length} events created`);
    console.log('Data imported successfully!');
    
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

// Execute
importData();