// import mongoose, { Document, Schema } from 'mongoose';
// import bcrypt from 'bcryptjs';
// import { IUser, UserRole, UserStatus } from '../types/user';

// export interface IUserDocument extends IUser, Document {
//   matchPassword(enteredPassword: string): Promise<boolean>;
// }

// const userSchema = new Schema<IUserDocument>({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: Object.values(UserRole),
//     default: UserRole.VOLUNTEER,
//   },
//   status: {
//     type: String,
//     enum: Object.values(UserStatus),
//     default: UserStatus.PENDING,
//   },
//   phoneNumber: {
//     type: String,
//   },
//   bloodGroup: {
//     type: String,
//   },
//   location: {
//     type: String,
//   },
//   skills: {
//     type: [String],
//     default: [],
//   },
//   registeredEvents: {
//     type: [Schema.Types.ObjectId],
//     ref: 'Event',
//     default: [],
//   },
// }, {
//   timestamps: true,
// });

// // Hash password before saving to DB
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare entered password with hashed password
// userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model<IUserDocument>('User', userSchema);

// export default User;


// backend/src/models/userModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '../types/user';

// Base interface without Document extension
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber?: string;
  bloodGroup?: string;
  location?: string;
  skills?: string[];
  registeredEvents?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Document interface with additional method
export interface IUserDocument extends IUser, Document {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.VOLUNTEER,
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.PENDING,
  },
  phoneNumber: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  location: {
    type: String,
  },
  skills: {
    type: [String],
    default: [],
  },
  registeredEvents: {
    type: [Schema.Types.ObjectId],
    ref: 'Event',
    default: [],
  },
}, {
  timestamps: true,
});

// Hash password before saving to DB
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;