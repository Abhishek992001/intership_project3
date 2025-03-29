# Volunteer Management System API Documentation

This document provides comprehensive information about the available API endpoints in the Volunteer Management System.

## Base URL

```
Development: http://localhost:5000
Production: [Your production URL]
```

## Authentication

Most endpoints require authentication using a JWT token. After logging in, include the token in the Authorization header of your requests:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Codes

- `200` - Success
- `201` - Resource created successfully
- `400` - Bad request
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Server error

## API Endpoints

### Authentication

#### Register User
- **URL**: `POST /api/auth/register`
- **Access**: Public
- **Description**: Register a new volunteer account
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "1234567890",
    "bloodGroup": "O+",
    "location": "Chennai",
    "skills": ["Teaching", "First Aid"]
  }
  ```
- **Response**: New user with "pending" status
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "volunteer",
    "status": "pending",
    "message": "Registration successful! Your account is pending approval."
  }
  ```

#### User Login
- **URL**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticate user and get token
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: User data and token
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "volunteer",
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

#### Get User Profile
- **URL**: `GET /api/auth/profile`
- **Access**: Protected
- **Description**: Get current user profile
- **Response**: Detailed user information
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "volunteer",
    "status": "approved",
    "phoneNumber": "1234567890",
    "bloodGroup": "O+",
    "location": "Chennai",
    "skills": ["Teaching", "First Aid"],
    "registeredEvents": ["60d21b4667d0d8992e610c90"]
  }
  ```

#### Update User Profile
- **URL**: `PUT /api/auth/profile`
- **Access**: Protected
- **Description**: Update current user profile
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phoneNumber": "9876543210",
    "password": "newpassword123" // Optional
  }
  ```
- **Response**: Updated user data with new token
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "volunteer",
    "status": "approved",
    "phoneNumber": "9876543210",
    "bloodGroup": "O+",
    "location": "Chennai",
    "skills": ["Teaching", "First Aid"],
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

### User Management

#### Get All Users
- **URL**: `GET /api/users`
- **Access**: Admin only
- **Description**: Get all user accounts
- **Response**: Array of all users
  ```json
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "volunteer",
      "status": "approved",
      "phoneNumber": "9876543210",
      "bloodGroup": "O+",
      "location": "Chennai"
    },
    // More users...
  ]
  ```

#### Get Pending Users
- **URL**: `GET /api/users/pending`
- **Access**: Admin only
- **Description**: Get users waiting for approval
- **Response**: Array of pending users
  ```json
  [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "volunteer",
      "status": "pending",
      "phoneNumber": "1234567891",
      "bloodGroup": "A-",
      "location": "Bangalore"
    },
    // More pending users...
  ]
  ```

#### Get Volunteer Directory
- **URL**: `GET /api/users/volunteers`
- **Access**: Protected
- **Description**: Get basic info of all approved volunteers
- **Response**: Array of volunteers with basic information
  ```json
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "bloodGroup": "O+",
      "location": "Chennai"
    },
    // More volunteers...
  ]
  ```

#### Get User by ID
- **URL**: `GET /api/users/:id`
- **Access**: Admin only
- **Description**: Get detailed information for a specific user
- **Response**: Detailed user data
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "volunteer",
    "status": "approved",
    "phoneNumber": "9876543210",
    "bloodGroup": "O+",
    "location": "Chennai",
    "skills": ["Teaching", "First Aid"],
    "registeredEvents": ["60d21b4667d0d8992e610c90"]
  }
  ```

#### Update User
- **URL**: `PUT /api/users/:id`
- **Access**: Admin only
- **Description**: Update any user's information
- **Request Body**:
  ```json
  {
    "name": "John Doe Updated",
    "role": "admin",
    "status": "approved"
  }
  ```
- **Response**: Updated user data
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "role": "admin",
    "status": "approved",
    "phoneNumber": "9876543210",
    "bloodGroup": "O+",
    "location": "Chennai",
    "skills": ["Teaching", "First Aid"]
  }
  ```

#### Delete User
- **URL**: `DELETE /api/users/:id`
- **Access**: Admin only
- **Description**: Delete a user account
- **Response**: Success message
  ```json
  {
    "message": "User removed"
  }
  ```

#### Update User Status
- **URL**: `PUT /api/users/:id/status`
- **Access**: Admin only
- **Description**: Approve or reject a user
- **Request Body**:
  ```json
  {
    "status": "approved" // or "rejected" or "pending"
  }
  ```
- **Response**: User with updated status
  ```json
  {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "approved"
  }
  ```

### Event Management

#### Get All Events
- **URL**: `GET /api/events`
- **Access**: Protected
- **Description**: Get all events
- **Response**: Array of all events
  ```json
  [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "title": "Beach Cleanup Drive",
      "description": "Help clean up the local beach",
      "location": "Marina Beach, Chennai",
      "startDate": "2023-06-15T09:00:00Z",
      "endDate": "2023-06-15T13:00:00Z",
      "status": "upcoming",
      "maxVolunteers": 20,
      "registeredVolunteers": ["60d21b4667d0d8992e610c85"],
      "skills": ["Environment", "Physical work"],
      "createdBy": "60d21b4667d0d8992e610c84"
    },
    // More events...
  ]
  ```

#### Get Event by ID
- **URL**: `GET /api/events/:id`
- **Access**: Protected
- **Description**: Get detailed information for a specific event
- **Response**: Detailed event data
  ```json
  {
    "_id": "60d21b4667d0d8992e610c90",
    "title": "Beach Cleanup Drive",
    "description": "Help clean up the local beach and protect marine life",
    "location": "Marina Beach, Chennai",
    "startDate": "2023-06-15T09:00:00Z",
    "endDate": "2023-06-15T13:00:00Z",
    "status": "upcoming",
    "maxVolunteers": 20,
    "registeredVolunteers": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "skills": ["Environment", "Physical work"],
    "createdBy": "60d21b4667d0d8992e610c84",
    "createdAt": "2023-05-01T10:30:00Z",
    "updatedAt": "2023-05-10T15:20:00Z"
  }
  ```

#### Create Event
- **URL**: `POST /api/events`
- **Access**: Admin only
- **Description**: Create a new event
- **Request Body**:
  ```json
  {
    "title": "Food Distribution",
    "description": "Distribute food packages to homeless shelters",
    "location": "MG Road, Bangalore",
    "startDate": "2023-07-20T10:00:00Z",
    "endDate": "2023-07-20T16:00:00Z",
    "status": "upcoming",
    "maxVolunteers": 15,
    "skills": ["Cooking", "Driving"]
  }
  ```
- **Response**: Created event
  ```json
  {
    "_id": "60d21b4667d0d8992e610c91",
    "title": "Food Distribution",
    "description": "Distribute food packages to homeless shelters",
    "location": "MG Road, Bangalore",
    "startDate": "2023-07-20T10:00:00Z",
    "endDate": "2023-07-20T16:00:00Z",
    "status": "upcoming",
    "maxVolunteers": 15,
    "registeredVolunteers": [],
    "skills": ["Cooking", "Driving"],
    "createdBy": "60d21b4667d0d8992e610c84",
    "createdAt": "2023-05-15T12:00:00Z",
    "updatedAt": "2023-05-15T12:00:00Z"
  }
  ```

#### Update Event
- **URL**: `PUT /api/events/:id`
- **Access**: Admin only
- **Description**: Update an existing event
- **Request Body**:
  ```json
  {
    "title": "Food Distribution - Updated",
    "maxVolunteers": 20,
    "status": "ongoing"
  }
  ```
- **Response**: Updated event
  ```json
  {
    "_id": "60d21b4667d0d8992e610c91",
    "title": "Food Distribution - Updated",
    "description": "Distribute food packages to homeless shelters",
    "location": "MG Road, Bangalore",
    "startDate": "2023-07-20T10:00:00Z",
    "endDate": "2023-07-20T16:00:00Z",
    "status": "ongoing",
    "maxVolunteers": 20,
    "registeredVolunteers": [],
    "skills": ["Cooking", "Driving"],
    "createdBy": "60d21b4667d0d8992e610c84",
    "createdAt": "2023-05-15T12:00:00Z",
    "updatedAt": "2023-05-16T09:30:00Z"
  }
  ```

#### Delete Event
- **URL**: `DELETE /api/events/:id`
- **Access**: Admin only
- **Description**: Delete an event
- **Response**: Success message
  ```json
  {
    "message": "Event removed"
  }
  ```

#### Register for Event
- **URL**: `POST /api/events/:id/register`
- **Access**: Volunteer only
- **Description**: Register current user for an event
- **Response**: Success message
  ```json
  {
    "message": "Successfully registered for event"
  }
  ```

#### Unregister from Event
- **URL**: `POST /api/events/:id/unregister`
- **Access**: Volunteer only
- **Description**: Unregister current user from an event
- **Response**: Success message
  ```json
  {
    "message": "Successfully unregistered from event"
  }
  ```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error message describing what went wrong",
  "stack": "Error stack trace (only in development mode)"
}
```

## Notes

- All dates are in ISO format (UTC)
- Token expiration is set to 30 days by default
- Password fields are never returned in responses
- User accounts require admin approval before they can log in