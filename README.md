# DemoApp UI

A web application built with Next.js, TypeScript, and Tailwind CSS, featuring authentication and role-based access control.

## Design Decisions

### Frontend Architecture
- **Next.js 14**: For server-side rendering and routing
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Component Structure**:
  - Reusable components
  - Clear separation of concerns

### State Management
- **React Context**: For global state management
- **Local State**: For component-specific state

### Authentication
- **JWT Integration**: Token management
- **Protected Routes**: Role-based access control
- **Session Management**: Token storage

## Default Admin Account

For initial access to the admin dashboard, use these credentials:

```
Email: admin@gmail.com
Password: 12345
```

## Setup Instructions

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Modern web browser

### Installation
1. Clone the repository
2. Navigate to the UI directory:
```bash
cd UI/demoapp-ui
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Running the Application
1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production
1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm run start
# or
yarn start
```

## Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── admin/          # Admin routes
│   ├── auth/           # Authentication routes
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
├── services/          # API services
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Features
1. **Authentication**
   - Login/Logout
   - Session management

2. **User Management**
   - User CRUD operations

3. **Admin Dashboard**
   - User Management

## Pages
1. **Authentication**
   - `/login` - User login
   - `/register` - User registration

2. **Admin**
   - `/admin/dashboard` - Admin dashboard
   - `/admin/users` - User management
   - `/admin/users/create` - Create user
   - `/admin/users/[id]/edit` - Edit user

## Security Considerations
1. **Authentication**
   - Token storage
   - Protected routes

2. **Data Protection**
   - Input validation
   - Secure API calls



