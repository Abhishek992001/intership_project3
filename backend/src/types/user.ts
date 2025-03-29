export enum UserRole {
  ADMIN = 'admin',
  VOLUNTEER = 'volunteer',
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber?: string;
  bloodGroup?: string;
  location?: string;
  skills?: string[];
  registeredEvents?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}