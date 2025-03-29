// import mongoose, { Document, Schema } from 'mongoose';
// import { IEvent, EventStatus } from '../types/event';

// export interface IEventDocument extends IEvent, Document {}

// const eventSchema = new Schema<IEventDocument>({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: Object.values(EventStatus),
//     default: EventStatus.UPCOMING,
//   },
//   maxVolunteers: {
//     type: Number,
//   },
//   registeredVolunteers: {
//     type: [Schema.Types.ObjectId],
//     ref: 'User',
//     default: [],
//   },
//   skills: {
//     type: [String],
//     default: [],
//   },
//   createdBy: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
// }, {
//   timestamps: true,
// });

// const Event = mongoose.model<IEventDocument>('Event', eventSchema);

// export default Event;

// backend/src/models/eventModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { EventStatus } from '../types/event';

// Base interface without Document extension
export interface IEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  maxVolunteers?: number;
  registeredVolunteers?: mongoose.Types.ObjectId[];
  skills?: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Document interface that combines IEvent with Document
export interface IEventDocument extends IEvent, Document {}

const eventSchema = new Schema<IEventDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.UPCOMING,
  },
  maxVolunteers: {
    type: Number,
  },
  registeredVolunteers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Event = mongoose.model<IEventDocument>('Event', eventSchema);

export default Event;