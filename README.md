## Find your treasure!

# YardHopper
YardHopper is a full-stack application consisting of a mobile app built with Expo/React Native and a backend API built with Node.js and Express.

## Table of Contents
- Client-Side (Mobile App)
- Server-Side (YardHopperAPI)
- API Documentation
- Data Management
- Security
- Auto-Cleanup
- Client-Side (Mobile App)
- Project Structure
- The client-side project uses Expo, which creates a .expo folder in the project.

## The .expo folder contains:
devices.json: Information about devices that have recently opened this project.
settings.json: Server configuration used to serve the application manifest.
Note: The .expo folder should not be committed to version control as it contains machine-specific information.

## Server-Side (YardHopperAPI)
The server-side component is hosted on Render and provides the backend functionality for YardHopper.

## API Core Structure
The API follows the Separation of Concerns principle, making it modular, testable, and maintainable. The structure includes:

src/: Main functionality
app.ts: Express application configuration
server.ts: Main entry point
config/: Environment and Firebase configurations
routes/: API endpoints
controllers/: Request handling and response construction
services/: Database and storage interactions
models/: Interfaces and types
middlewares/: Authentication and error handling
swagger/: API documentation configuration
Framework and Technologies
Node.js
Express
Firebase (Authentication, Firestore, Storage)
Swagger
Multer
Crypto
geoFirestore
API Documentation
For detailed API documentation, please visit the Swagger UI.

## Main Endpoints
- Listings: /api/listings
- Users: /api/users
- Each endpoint has various operations (GET, POST, PUT, DELETE) for managing listings and user data.

## Data Management
YardHopper uses Firestore, a NoSQL database, for data storage. The main collections are:

listings: Stores information about yard sales and other events.
users: Stores user profile information.
Security
Authentication
Firebase Authentication is used for user management.
Each API request requires an authenticated user with a valid ID token.
Encryption
Sensitive information is encrypted before transmission to ensure data privacy.

## Privacy
User information is kept private and not publicly accessible.
Users can archive or delete their posts and account data.
Auto-Cleanup
A cloud function runs daily at midnight to:

## Archive expired listings
Update the status of upcoming listings to active when appropriate
For more detailed information on specific endpoints, data structures, or development setup, please refer to the respective sections in this README or the API documentation.

# Authors:
Chris Gillis
Mark Tipton
Allison Binger
Mariah Bargas
Kier McAlister
