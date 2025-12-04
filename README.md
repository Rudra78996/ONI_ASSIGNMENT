# Library Management System

A full-stack library management application built with NestJS, PostgreSQL, Prisma, and React (TypeScript). This system allows managing books, authors, users, and book borrowing operations with JWT authentication.

## 🚀 Features

- **Authentication**: JWT-based authentication system
- **Books Management**: CRUD operations with advanced filtering (search, author, borrowed status)
- **Authors Management**: Complete author profile management
- **Users Management**: User registration and listing
- **Borrowing System**: 
  - Borrow books with automatic due date (14 days)
  - Return books
  - Track borrowing history
  - View borrowed books by user

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **Prisma** - Modern ORM with migrations
- **JWT** - JSON Web Tokens for authentication
- **Swagger** - API documentation
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icons
- **date-fns** - Date formatting

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

- **Responsive Design** - Works on desktop and mobile
- **Authentication Flow** - Login/Register with persistent sessions
- **Books Page**:
  - Search books by title/description
  - Filter by author
  - Filter by borrowed status
  - Add/Edit/Delete books
- **Authors Page**:
  - View all authors with book count
  - Add/Edit/Delete authors
- **Users Page**:
  - View all registered users
- **Borrowed Books Page**:
  - View all borrowing transactions
  - Borrow available books
  - Return borrowed books
  - Track due dates

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

1. **Database Schema**: Used UUID for all primary keys for better security and scalability. Implemented cascading deletes for related entities.

2. **Authentication**: JWT-based authentication with bcrypt password hashing. Tokens expire in 7 days (configurable).

3. **API Design**: RESTful API with proper HTTP methods and status codes. Public endpoints for reading, protected endpoints for write operations.

4. **Borrowing Logic**: 
   - Books can only be borrowed if not currently borrowed
   - Due date automatically set to 14 days from borrowing
   - Track both borrow and return dates

5. **Frontend State**: Used Zustand for lightweight state management. Authentication state persisted in localStorage.

6. **Filtering**: Server-side filtering for books by search term, author, and borrowed status for optimal performance.

7. **Error Handling**: Proper error handling on both backend (exception filters) and frontend (try-catch with user feedback).

## 🚧 Future Enhancements

- Book availability tracking with quantity
- Late fee calculation
- Email notifications for due dates
- User roles and permissions (Admin, Librarian, Member)
- Book reservation system
- Advanced search with multiple filters
- Pagination for large datasets
- Book categories and tags
- Book ratings and reviews
- Export reports (PDF, CSV)

## 📄 License

MIT

## 👤 Author

Built for ONI Full-Stack Intern Assignment
