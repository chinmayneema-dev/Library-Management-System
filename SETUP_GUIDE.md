# How to Run the Library Management System

## Quick Start Guide

Follow these steps to get the entire application running on your machine.

---

## Step 1: Prerequisites

Make sure you have installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (version 8 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **npm** (comes with Node.js)

Verify installations:
```bash
node --version
npm --version
mysql --version
```

---

## Step 2: Set Up MySQL Database

1. **Start MySQL Server** (if not already running)

2. **Create the database:**
   ```bash
   mysql -u root -p
   ```
   Then in MySQL prompt:
   ```sql
   CREATE DATABASE lms_db;
   EXIT;
   ```

   Or use MySQL Workbench/phpMyAdmin to create a database named `lms_db`.

---

## Step 3: Configure Backend

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create environment file:**
   ```bash
   # Windows PowerShell:
   Copy-Item env.example .env
   
   # Windows CMD:
   copy env.example .env
   
   # Mac/Linux:
   cp env.example .env
   ```

3. **Edit `.env` file** with your MySQL credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=lms_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_DIALECT=mysql
   
   JWT_SECRET=supersecretjwtkey
   JWT_EXPIRES_IN=1d
   
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```
   
   **Important:** Replace `your_mysql_password` with your actual MySQL root password.

4. **Install backend dependencies:**
   ```bash
   npm install
   ```

---

## Step 4: Configure Frontend

1. **Navigate to frontend folder** (open a new terminal):
   ```bash
   cd frontend
   ```

2. **Create environment file:**
   ```bash
   # Windows PowerShell:
   Copy-Item env.example .env
   
   # Windows CMD:
   copy env.example .env
   
   # Mac/Linux:
   cp env.example .env
   ```

3. **Edit `.env` file** (usually no changes needed):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Install frontend dependencies:**
   ```bash
   npm install
   ```

---

## Step 5: Run the Application

You need **TWO terminal windows** - one for backend, one for frontend.

### Terminal 1 - Backend Server:

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
Database connected successfully
Tables synchronized
Default admin user created
```

The backend will automatically:
- Connect to MySQL
- Create all tables (Books, Members, BorrowRecords, Users)
- Create indexes for fast queries
- Seed a default admin user (username: `admin`, password: `admin123`)

### Terminal 2 - Frontend Server:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 6: Access the Application

1. **Open your browser** and go to: `http://localhost:5173`

2. **Login as Librarian:**
   - Username: `admin`
   - Password: `admin123`

3. **Start using the system:**
   - Add books
   - Add members
   - Issue books
   - Search books
   - Return books

---

## Troubleshooting

### Backend won't start:

**Error: "Cannot connect to MySQL"**
- Check MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check `.env` file has correct credentials

**Error: "Port 5000 already in use"**
- Change `PORT=5000` to another port (e.g., `PORT=5001`) in `backend/.env`
- Update `VITE_API_BASE_URL` in `frontend/.env` to match

### Frontend won't start:

**Error: "Port 5173 already in use"**
- Vite will automatically use the next available port
- Or specify a port: `npm run dev -- --port 3000`

**Error: "Cannot connect to API"**
- Make sure backend is running on port 5000
- Check `VITE_API_BASE_URL` in `frontend/.env` matches backend port

### Database Issues:

**Tables not created:**
- Check MySQL connection in `.env`
- Look for error messages in backend terminal
- Try restarting backend server

---

## Default Credentials

- **Librarian Login:**
  - Username: `admin`
  - Password: `admin123`

**Note:** Change these in `backend/.env` after first login for security.

---

## Production Build

### Build Frontend:
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/` folder.

### Run Backend in Production:
```bash
cd backend
NODE_ENV=production npm start
```

---

## Stopping the Application

- Press `Ctrl + C` in both terminal windows to stop the servers.

---

## Need Help?

- Check the main `README.md` for more details
- Verify all environment variables are set correctly
- Ensure MySQL is running and accessible
- Check terminal output for specific error messages







