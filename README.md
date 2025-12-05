# Library Management System

A modern, full-stack library management application with a beautiful UI built using NestJS, PostgreSQL, Prisma, React (TypeScript), and shadcn/ui components. This system provides comprehensive management of books, authors, users, and book borrowing operations with JWT authentication.

## 🌐 Live Deployment

- **Frontend**: [https://frontend-psi-seven-53.vercel.app/](https://frontend-psi-seven-53.vercel.app/)
- **Backend API**: [https://oni-assignment.onrender.com](https://oni-assignment.onrender.com)
- **API Documentation**: [https://oni-assignment.onrender.com/api](https://oni-assignment.onrender.com/api)

## 🚀 Features

### Core Functionality
- **Authentication**: Secure JWT-based authentication with persistent sessions
- **Books Management**: Full CRUD operations with advanced filtering (search, author, borrowed status)
- **Authors Management**: Complete author profile management with biographical information
- **Users Management**: User registration and comprehensive user listing
- **Borrowing System**: 
  - Borrow books with automatic due date calculation (14 days)
  - Return books with tracking
  - Complete borrowing history
  - View borrowed books by user and status

### UI/UX Features
- **Modern Design**: Clean, professional interface using shadcn/ui components
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Dark/Light Mode**: Black and white theme throughout
- **Toggle Views**: Switch between card and list views for Books and Authors
- **Loading States**: Visual feedback with animated spinners during operations
- **Alert Dialogs**: Confirmation dialogs for destructive actions
- **Date Pickers**: Intuitive date selection for published dates and birth dates
- **Search & Filter**: Real-time search and multi-criteria filtering
- **Status Indicators**: Visual badges with colored dots for book availability

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** (Supabase) - Relational database
- **Prisma** - Modern ORM with type-safe database access
- **JWT** - JSON Web Tokens for authentication
- **Swagger** - Interactive API documentation
- **bcrypt** - Secure password hashing
- **class-validator** - Request validation

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **React Router 6** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - Promise-based HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
  - Button, Card, Input, Select, DatePicker, AlertDialog
  - Field, Label, NavigationMenu, Calendar, Popover
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon library
- **date-fns** - Modern date utility library
- **Inter Font** - Clean, professional typography

## 📦 Project Structure

```
ONI/
├── backend/              # NestJS backend
│   ├── prisma/          # Database schema and migrations
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── users/       # Users module
│   │   ├── authors/     # Authors module
│   │   ├── books/       # Books module
│   │   ├── borrowed-books/  # Borrowing module
│   │   ├── prisma/      # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
└── frontend/            # React frontend
    ├── src/
    │   ├── api/        # API client and services
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── store/      # State management
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (v16 or higher) OR Docker
- npm or yarn

### Option 1: Using Docker (Recommended)

This will start both PostgreSQL and the backend API.

1. **Clone the repository**
```bash
cd backend
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env if needed (default values should work with Docker)
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

This will:
- Start PostgreSQL on port 5432
- Run database migrations
- Seed the database with sample data
- Start the backend API on port 3000

4. **View Swagger API Documentation**
```bash
# Open in browser
http://localhost:3000/api
```

### Option 2: Local Setup (Without Docker)

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure your PostgreSQL connection:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/library_db?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRATION="7d"
PORT=3000
NODE_ENV=development
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Generate Prisma Client**
```bash
npx prisma generate
```

6. **Seed the database**
```bash
npm run prisma:seed
```

7. **Start the backend server**
```bash
npm run start:dev
```

The backend will be running at `http://localhost:3000`
API documentation available at `http://localhost:3000/api`

#### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000
```

4. **Start the frontend development server**
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🔑 Demo Credentials

After seeding, you can use these credentials to login:

```
Email: john@example.com
Password: password123
```

OR

```
Email: jane@example.com
Password: password123
```

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - Login with email and password

### Users
- `POST /users` - Create a new user (public)
- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)

### Authors
- `POST /authors` - Create author (protected)
- `GET /authors` - Get all authors (public)
- `GET /authors/:id` - Get author by ID (public)
- `PATCH /authors/:id` - Update author (protected)
- `DELETE /authors/:id` - Delete author (protected)

### Books
- `POST /books` - Create book (protected)
- `GET /books` - Get all books with filters (public)
  - Query params: `search`, `authorId`, `borrowed`
- `GET /books/:id` - Get book by ID (public)
- `PATCH /books/:id` - Update book (protected)
- `DELETE /books/:id` - Delete book (protected)

### Borrowed Books
- `POST /borrowed-books` - Borrow a book (protected)
- `PATCH /borrowed-books/:id/return` - Return a book (protected)
- `GET /borrowed-books/user/:userId` - Get borrowed books by user (protected)
- `GET /borrowed-books` - Get all borrowed books (protected)

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

To get a token:
1. Register a new user via `POST /users`
2. Login via `POST /auth/login` with email and password
3. Use the returned `accessToken` in subsequent requests

## 🎨 Frontend Features

### Pages & Components
- **Login/Register Pages**: 
  - Modern signup-03 pattern from shadcn
  - Centered layout with muted backgrounds
  - Field components with validation
  - Persistent authentication

- **Books Page**:
  - Toggle between card grid and table list views
  - Real-time search by title/description
  - Filter by author (dropdown)
  - Filter by borrowed status (Available/Borrowed)
  - Date picker for published date
  - Visual status badges with colored indicators
  - Edit/Delete actions with confirmation dialogs
  - Loading states on all operations

- **Authors Page**:
  - Toggle between card grid and table list views
  - Display author info with book count
  - Date picker for birth date
  - Bio with truncation (line-clamp)
  - Edit/Delete actions with confirmation
  - Loading indicators

- **Borrowed Books Page**:
  - Clean table layout with book and user information
  - Borrow new books with user and book selection
  - Return functionality with confirmation
  - Status tracking (Borrowed/Returned)
  - Date tracking (borrowed date, due date, return date)
  - Loading states on borrow and return

### UI Components Used
- **Navigation**: Black/white themed navbar with NavigationMenu
- **Forms**: Field components with labels and validation
- **Inputs**: Search inputs with icons, Select dropdowns, DatePickers
- **Cards**: Modern card layouts for grid views
- **Tables**: Clean, responsive table layouts for list views
- **Buttons**: Black default variant with loading states
- **Dialogs**: Alert confirmations for destructive actions
- **Icons**: BookOpen, Calendar, User, Edit, Trash, LayoutGrid, List, Loader2
- **Loading**: Animated spinners for async operations

## 🗄️ Database Schema

### User
- id (UUID)
- email (unique)
- name
- password (hashed)
- createdAt, updatedAt

### Author
- id (UUID)
- name
- bio (optional)
- birthDate (optional)
- createdAt, updatedAt

### Book
- id (UUID)
- title
- isbn (unique, optional)
- description (optional)
- publishedAt (optional)
- authorId (FK to Author)
- createdAt, updatedAt

### BorrowedBook
- id (UUID)
- bookId (FK to Book)
- userId (FK to User)
- borrowedAt
- returnedAt (optional)
- dueDate
- createdAt, updatedAt

## 🧪 Testing the API

### Using Swagger UI
1. Navigate to `http://localhost:3000/api`
2. Authorize with a JWT token
3. Test endpoints directly from the UI

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get all books:**
```bash
curl http://localhost:3000/books
```

**Create a book (requires auth):**
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Book",
    "authorId": "AUTHOR_UUID",
    "isbn": "1234567890",
    "description": "A great book"
  }'
```

## 🛠️ Development

### Backend

**Run in development mode:**
```bash
npm run start:dev
```

**Build for production:**
```bash
npm run build
npm run start:prod
```

**Run tests:**
```bash
npm run test
```

**View database in Prisma Studio:**
```bash
npm run prisma:studio
```

**Create a new migration:**
```bash
npx prisma migrate dev --name migration_name
```

### Frontend

**Run development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 🐳 Docker Commands

**Start services:**
```bash
docker-compose up -d
```

**Stop services:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```

**Rebuild and start:**
```bash
docker-compose up -d --build
```

## 📝 Design Decisions

### Backend Architecture
1. **Database Schema**: Used UUID for all primary keys for better security, distribution, and scalability. Implemented proper cascading deletes for related entities to maintain referential integrity.

2. **Authentication**: JWT-based stateless authentication with bcrypt password hashing (10 rounds). Tokens expire in 7 days (configurable via environment variables).

3. **API Design**: RESTful API following best practices with proper HTTP methods (GET, POST, PATCH, DELETE) and status codes. Public endpoints for reading data, protected endpoints for write operations.

4. **Borrowing Logic**: 
   - Books can only be borrowed if not currently borrowed (enforced at database level)
   - Due date automatically calculated as 14 days from borrowing date
   - Track both borrow and return timestamps for complete history
   - One active borrow per book at a time

5. **Validation**: Server-side validation using class-validator decorators with proper error messages and HTTP status codes.

6. **Error Handling**: Comprehensive exception filters for consistent error responses across the API.

### Frontend Architecture
1. **State Management**: Zustand for lightweight, performant state management. Authentication state persisted in localStorage with automatic rehydration.

2. **Component Library**: shadcn/ui components for consistent, accessible, and customizable UI. All components follow the black/white theme.

3. **Data Fetching**: Centralized API client using Axios with proper error handling and loading states throughout the application.

4. **Filtering**: Implemented client-side triggers with server-side filtering for optimal performance on large datasets.

5. **UX Enhancements**:
   - Loading spinners on all async operations (create, update, delete, borrow, return)
   - Confirmation dialogs for destructive actions with loading states
   - Disabled states to prevent double submissions
   - Visual feedback with status badges and icons
   - Toggle views for different user preferences

6. **Type Safety**: Full TypeScript implementation with proper interfaces for all API responses and component props.

7. **Accessibility**: Using Radix UI primitives ensures keyboard navigation, ARIA attributes, and screen reader support.

### UI/UX Patterns
1. **Consistent Layouts**: All CRUD pages follow similar patterns for ease of use
2. **Visual Hierarchy**: Clear separation between headers, filters, and content
3. **Responsive Grid**: 1/2/3 column layouts that adapt to screen size
4. **Color Coding**: Green for available, red for borrowed, consistent throughout
5. **Icon Usage**: Meaningful icons that enhance understanding (Calendar, Book, User)
6. **Loading States**: Never leave users wondering if something is happening


## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected routes requiring valid tokens
- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- XSS protection through React's built-in escaping
- CORS configuration for production
- Environment variable management
- Secure HTTP-only cookie support (configurable)

## 🚀 Deployment

### Quick Deploy

**Frontend (Vercel):**
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com`
4. Deploy automatically

**Backend (Railway/Render):**
1. Connect GitHub repository
2. Set root directory to `backend`
3. Add PostgreSQL database
4. Configure environment variables (see DEPLOYMENT.md)
5. Deploy

### Detailed Instructions

For comprehensive deployment guide including step-by-step instructions for production deployment, database setup, environment configuration, and troubleshooting, see the [Deployment](#-deployment) section above.

### Environment Variables

**Frontend:**
```env
VITE_API_URL=https://oni-assignment.onrender.com
```

**Backend:**
```env
DATABASE_URL=postgresql://user:password@host:5432/library_db
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
NODE_ENV=production
FRONTEND_URL=https://frontend-psi-seven-53.vercel.app
```

## 🌐 Production URLs

- **Live Application**: [https://frontend-psi-seven-53.vercel.app/](https://frontend-psi-seven-53.vercel.app/)
- **Backend API**: [https://oni-assignment.onrender.com](https://oni-assignment.onrender.com)
- **API Documentation (Swagger)**: [https://oni-assignment.onrender.com/api](https://oni-assignment.onrender.com/api)



## 👤 Author

**Rudra**
- GitHub: [@Rudra78996](https://github.com/Rudra78996)
- Repository: [ONI_ASSIGNMENT](https://github.com/Rudra78996/ONI_ASSIGNMENT)

Built for ONI Full-Stack Intern Assignment
---