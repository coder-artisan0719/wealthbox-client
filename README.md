# Wealthbox Frontend
## Overview
The Wealthbox frontend is a React application that provides a user interface for managing organizations, users, and integrations with the Wealthbox CRM system. It offers a clean, responsive interface built with Material UI components.

## Technology Stack
- Framework : React with TypeScript
- UI Library : Material UI
- State Management : React Context API
- HTTP Client : Axios
- Routing : React Router
- Authentication : JWT-based authentication
## Project Structure
```plaintext
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
 ```

## Key Features
### Organization Management
- View list of organizations with pagination
- Create new organizations
- Edit existing organization details
- Delete organizations with confirmation
### User Management
- View and manage users
- Assign users to organizations
### Wealthbox Integration
- Configure Wealthbox API connection
- Sync users from Wealthbox CRM
- View Wealthbox user data
### Authentication
- Secure login and logout
- Protected routes for authenticated users
## Setup and Installation
### Prerequisites
- Node.js (v14+)
- npm or yarn
### Installation Steps
1. Clone the repository
2. Install dependencies:
   ```plaintext
   npm install
    ```
3. Create a .env file with the following variables:
   ```plaintext
   REACT_APP_API_URL=https://wealthbox-server.onrender.com/api
    ```
4. Start the development server:
   ```plaintext
   npm start
    ```
5. Build for production:
   ```plaintext
   npm run build
    ```
## Development
### Component Structure
Components follow a consistent pattern:

- Functional components with TypeScript
- React hooks for state management
- Material UI for styling
- Context API for shared state
### API Integration
The application communicates with the backend through a centralized API service:

- src/services/api.ts contains all API calls
- Axios is used for HTTP requests
- Authentication tokens are automatically included in requests
### State Management
- Context API is used for global state management
- PaginationContext maintains pagination state across the application
- AuthContext manages user authentication state

## Deployment
For production deployment:

1. Build the application:

   ```plaintext
   npm run build
    ```
2. Deploy the contents of the build directory to your web server