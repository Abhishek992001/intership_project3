export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  maxVolunteers?: number;
  registeredVolunteers?: string[];
  skills?: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}