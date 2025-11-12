# Library Management System (LMS)

Full-stack web application for managing library operations with separate experiences for librarians (administrators) and members. The project is structured as a RESTful Node.js backend (`backend/`) and a React + Vite frontend (`frontend/`).

## Features

- **Authentication:** JWT-based login for librarians and members, with auto-provisioned default librarian account.
- **Role-based dashboards:** Librarian dashboard for managing books, members, issuing/returning books, and searching. Member dashboard to view available books, issued items, and history.
- **Book management:** CRUD operations, status tracking, and indexed ISBN field.
- **Member management:** Member onboarding, optional account creation, and borrow history.
- **Borrowing workflow:** Issue, return, and monitor active borrowing records.
- **Search:** Filter books by title, author, or category for both roles.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8+ (or compatible)

### Backend Setup (`backend/`)

1. Copy the environment template and update the values for your MySQL instance:
   ```bash
   cd backend
   copy env.example .env    # Windows PowerShell: Copy-Item env.example .env
   ```
2. Update `.env` with database credentials, JWT secret, and optional admin credentials.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the API (development):
   ```bash
   npm run dev
   ```
   The server connects to MySQL, synchronises tables (normalized to 3NF) and ensures indexes on `isbn`, `member_id`, and `book_id`. It also seeds a default librarian user (`ADMIN_USERNAME` / `ADMIN_PASSWORD`).

### Frontend Setup (`frontend/`)

1. Copy the environment template and adjust the API base URL if needed:
   ```bash
   cd frontend
   copy env.example .env    # Windows PowerShell: Copy-Item env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The React app uses React Router, Material UI, and React Query to interact with the backend.

### Available Scripts

| Location   | Command           | Description                         |
|------------|-------------------|-------------------------------------|
| backend    | `npm run dev`     | Start API with Nodemon              |
| backend    | `npm start`       | Start API in production mode        |
| backend    | `npm test`        | Placeholder                         |
| frontend   | `npm run dev`     | Start Vite dev server               |
| frontend   | `npm run build`   | Build production bundle             |
| frontend   | `npm run preview` | Preview production build            |

## API Overview

- `POST /api/auth/login`
- `POST /api/books`, `PUT /api/books/:id`, `DELETE /api/books/:id`, `GET /api/books`, `GET /api/books/search`
- `POST /api/members`, `GET /api/members`, `GET /api/members/:id`, `GET /api/members/:id/history`
- `POST /api/borrow/issue`, `POST /api/borrow/return`, `GET /api/borrow`

All endpoints (except login) require a Bearer token. Librarian-only routes enforce role-based authorization.

## Database Design

- **Tables:** `users`, `members`, `books`, `borrow_records`
- **Normalization:** Separated entities with foreign keys respecting 3NF.
- **Indexes:** Unique index on `books.isbn`; standard indexes on `borrow_records.member_id` and `borrow_records.book_id`; unique constraint on `members.email`.

## Deployment Notes

- Configure environment variables in hosting environment (e.g., Docker secrets, cloud config).
- Use `npm run build` in `frontend/` and serve the static `dist/` folder behind a CDN or static host.
- Host backend on Node-compatible environment (e.g., Render, Railway, Azure App Service) with a managed MySQL instance.
- Set `NODE_ENV=production` and ensure secure `JWT_SECRET`.

## Testing

- Unit/integration testing scaffolding is not included; install Jest/Vitest and Supertest to extend.
- Manual verification steps:
  - Login as default admin and create members/books.
  - Issue and return books; verify status transitions.
  - Login as member to confirm dashboard data and search function.

## Folder Structure

```
backend/
  src/
    config/       # Sequelize setup
    controllers/  # Route handlers
    middleware/   # Auth & validation middleware
    models/       # Sequelize models with associations
    routes/       # Express routers
    services/     # Seed logic
    validators/   # express-validator schemas
frontend/
  src/
    api/          # Axios wrappers for API endpoints
    components/   # Shared UI components (layout, protected routes)
    context/      # Auth provider
    hooks/        # Custom hooks
    pages/        # Librarian/member pages
    theme/        # Material UI theme
    utils/        # Formatting helpers
```

## Credentials

- Default librarian: `admin / admin123` (change in `.env` once seeded).
- New members can optionally receive login credentials via the "Add Member" form.

## License

MIT (update as needed).


## Admin Password:
UserName: admin
Password: admin@LMS123




