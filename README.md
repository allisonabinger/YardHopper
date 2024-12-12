# YardHopper - A Comprehensive Garage Sale App

## Project Overview

YardHopper is a full-stack mobile application designed to simplify the process of discovering and organizing garage sales within local communities. Developed using Expo, React Native, and Firebase, this app provides a centralized platform for bargain hunters and enthusiasts who enjoy treasure hunting at yard sales.

## Key Features

- User-friendly interface for searching nearby garage sales
- Ability to explore detailed listings of items available for purchase
- Feature for users to create and manage their own sales
- Comprehensive search functionality with filtering options
- Interactive map view for visualizing sale locations
- User profile management and settings
- Integration with device features like photo library and location services

## Architecture

The YardHopper application is built as a full-stack solution with the following components:

- Frontend: Developed using Expo and React Native, providing a native mobile app experience
- Backend: Built with Firebase Cloud Functions and Firestore database with a custom API hosted on Render

## Core Functionality

1. **User Authentication**: Secure login and account management system
2. **Sale Discovery**: Search and filter garage sales based on various criteria
3. **Listing Management**: Create, edit, and delete personal garage sale listings
4. **Item Details**: View comprehensive information about individual sale items
5. **Map Integration**: Visualize sale locations on an interactive map
6. **Image Upload**: Add and manage images for sale listings
7. **Location Services**: Use device GPS for precise sale location tracking

## API Documentation

The API documentation can be found at https://yardhopperapi.onrender.com/api-docs. It provides detailed information on available endpoints, request/response formats, and authentication requirements.

## Security Measures

- Authentication is handled using Firebase authentication
- All sensitive data is encrypted before transmission
- Private user information is not publicly accessible
- Users can archive their posts and delete their accounts, ensuring data privacy

## Data Management

The application utilizes a NoSQL schema in Firestore for efficient data storage and retrieval. Data is structured to balance public accessibility with user privacy.

## Best Practices

- Separation of Concerns: Modular design for improved maintainability and testability
- Error Handling: Comprehensive error management system with custom error classes
- Validation: Rigorous input validation to ensure data integrity
- Geolocation Integration: Utilizes GeoApify API for accurate location-based services

## Acknowledgments

Special thanks to all contributors who have made this project possible:

- Chris Gillis
- Mark Tipton
- Allison Binger
- Mariah Bargas
- Kier McAlister

## Support Information

For any questions or issues, please feel free to reach out:

- Email: yardhopperadmn@gmail.com

We appreciate your feedback.

Happy treasure hunting!
