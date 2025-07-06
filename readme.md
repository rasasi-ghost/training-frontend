# Training API Frontend

A comprehensive learning management system frontend that connects to a backend API. The application supports multiple user roles including students, teachers, and administrators.

## Project Overview

This frontend application provides a complete interface for an online learning platform with the following features:

- **User Authentication**: Login, registration, and session management
- **Course Management**: Browse, create, and manage courses
- **Enrollments**: Manage student enrollments and course progress
- **Teacher Features**: Course creation, lecture management, and student grading
- **Admin Dashboard**: User management and teacher approval system
- **Responsive Design**: Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices
- **Theming System**: Multiple theme options including light, dark, and custom color schemes
- **Accessibility Features**: WCAG compliant with screen reader support and keyboard navigation

## UI Features

- **Multiple Themes**: Choose from light, dark, high contrast, and custom color themes
- **Responsive Layout**: Optimized for all screen sizes from mobile to large desktop displays
- **Interactive Dashboard**: Real-time data visualization and progress tracking
- **Rich Media Support**: Video lectures, PDF materials, and interactive quizzes
- **Offline Mode**: Access previously loaded content without an internet connection
- **Internationalization**: Support for multiple languages
- **Notifications**: Real-time alerts for course updates, new grades, and administrative actions
- **Drag-and-Drop Interface**: Intuitive content management for teachers

## Key Components

### User Management

- Authentication (login/logout)
- Student and teacher registration
- Profile management
- Role-based access control

### Course Features

- Course browsing and enrollment
- Course creation and management for teachers
- Lecture management
- Student progress tracking

### Administrative Tools

- User management
- Teacher application approval
- Role management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd /Users/macair/Desktop/hw/training-api/fe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   REACT_APP_API_BASE_URL=<your-backend-api-url>
   REACT_APP_FIREBASE_API_KEY=<your-firebase-api-key>
   REACT_APP_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
   REACT_APP_FIREBASE_PROJECT_ID=<your-firebase-project-id>
   REACT_APP_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
   REACT_APP_FIREBASE_APP_ID=<your-firebase-app-id>
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Architecture

The application follows a Model-View-Controller (MVC) architecture with MobX for state management:

### MVC Implementation

- **Models**: Represented by MobX stores that maintain application state
- **Views**: React components that render the UI based on the state
- **Controllers**: Service classes that handle business logic and connect views to models

### State Management with MobX

- **Observable State**: All application state is observable through MobX
- **Actions**: State modifications happen through explicit actions
- **Computed Values**: Derived state is automatically calculated
- **Reactions**: UI components automatically re-render when relevant state changes

### Advantages of this Architecture

- **Clean Separation of Concerns**: UI logic is separate from business logic
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes to one layer don't necessarily affect others
- **Developer Experience**: Predictable state management and debugging

## Project Structure

The application follows a controller-based architecture with MobX for state management:

```
/src
├── /assets            # Static assets like images, fonts, etc.
├── /components        # Reusable UI components
│   ├── /common        # Shared components (buttons, inputs, etc.)
│   ├── /layouts       # Layout components
│   └── /specific      # Feature-specific components
├── /controllers       # Business logic controllers
├── /hooks             # Custom React hooks
├── /pages             # Page components
│   ├── /admin         # Admin-specific pages
│   ├── /auth          # Authentication pages
│   ├── /courses       # Course-related pages
│   └── /profile       # User profile pages
├── /routes            # Application routing
├── /services          # API and external service integrations
├── /state             # MobX stores
├── /styles            # Global styles and theme definitions
├── /types             # TypeScript type definitions
└── /utils             # Utility functions
```

### Controllers

Handle business logic and connect UI to services:
- `UserController`: Authentication and user profile management
- `CoursesController`: Student course browsing and enrollment
- `TeacherCourseController`: Teacher-specific course management
- `AdminUsecasesController`: Administrative functions

### Services

API communication and external services:
- `ApiService`: Base HTTP client
- `AuthService`: Authentication operations
- `TeacherService`: Teacher-specific API operations
- `CourseService`: Course-related API operations
- `AdminService`: Admin-specific API operations
- `LocalStorageService`: Local data persistence

### Stores (Models)

MobX state management:
- `UserStore`: User session and profile data
- `MyCoursesStore`: Student course enrollments
- `TeacherCoursesStore`: Teacher's created courses
- `AdminUsecasesStore`: Admin-specific state

## User Roles

The application supports three main user roles:

1. **Student**: Can browse courses, enroll, and view course content
2. **Teacher**: Can create and manage courses, add lectures, and grade students
3. **Admin**: Can manage all users, approve teacher applications, and manage roles

## Development Guidelines

- Add new controllers in the `/src/controllers` directory
- Service classes should handle all API communication
- Use MobX stores for state management
- Follow the existing pattern of returning standardized response objects from controller methods

## API Integration

The frontend communicates with a backend API for all data operations. Authentication is handled via Firebase, with tokens passed to the backend API for verification.

## Theming System

The application includes a comprehensive theming system:

- **Theme Switcher**: Easily switch between light and dark modes
- **Custom Colors**: Personalize primary, secondary, and accent colors
- **Theme Persistence**: User theme preferences are saved between sessions
- **Automatic Mode**: Option to follow system preferences for light/dark mode
- **Branded Themes**: Support for institution-specific branded themes

## Responsive Design

The frontend is built with a mobile-first approach:

- **Adaptive Layouts**: Content automatically adjusts to different screen sizes
- **Touch-Friendly Controls**: Optimized for touchscreen devices
- **Responsive Tables**: Data tables transform into card views on smaller screens
- **Collapsible Navigation**: Menu automatically collapses on mobile devices
- **Optimized Media**: Images and videos adapt to screen size and bandwidth

## Accessibility

The application follows WCAG 2.1 AA standards:

- **Screen Reader Compatible**: All components work with popular screen readers
- **Keyboard Navigation**: Full functionality available without a mouse
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: All text meets minimum contrast requirements
- **Text Scaling**: Interface remains functional when text is enlarged

## License

[Your License Information]