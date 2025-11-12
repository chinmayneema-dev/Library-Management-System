# 🚀 Quick Start Guide

## Run the Application in 5 Steps

### 1️⃣ Set Up MySQL Database

Open MySQL and create the database:
```sql
CREATE DATABASE lms_db;
```

### 2️⃣ Configure Backend

```bash
cd backend
Copy-Item env.example .env
```

**Edit `backend/.env`** - Update your MySQL password:
```env
DB_PASSWORD=your_mysql_password  # ← Change this!
```

### 3️⃣ Configure Frontend

```bash
cd ..\frontend
Copy-Item env.example .env
```

(No changes needed in `frontend/.env` - it's already configured)

### 4️⃣ Install Dependencies

**Backend:**
```bash
cd ..\backend
npm install
```

**Frontend:**
```bash
cd ..\frontend
npm install
```

### 5️⃣ Run Both Servers

**Open TWO terminal windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6️⃣ Access the Application

Open browser: **http://localhost:5173**

**Login:**
- Username: `admin`
- Password: `admin123`

---

## ⚡ One-Line Commands (PowerShell)

If you want to set everything up quickly:

```powershell
# Backend setup
cd backend; Copy-Item env.example .env; npm install

# Frontend setup  
cd ..\frontend; Copy-Item env.example .env; npm install
```

**Remember to edit `backend/.env` and set your MySQL password!**

---

## 📝 What Happens When You Start?

**Backend (`npm run dev`):**
- ✅ Connects to MySQL
- ✅ Creates all database tables
- ✅ Creates indexes for fast queries
- ✅ Seeds default admin user
- ✅ Starts API server on port 5000

**Frontend (`npm run dev`):**
- ✅ Starts Vite dev server
- ✅ Opens on http://localhost:5173
- ✅ Connects to backend API

---

## 🛑 To Stop

Press `Ctrl + C` in both terminal windows.

---

## ❓ Troubleshooting

**Backend won't start?**
- Check MySQL is running
- Verify database `lms_db` exists
- Check `backend/.env` has correct MySQL password

**Frontend can't connect?**
- Make sure backend is running on port 5000
- Check `frontend/.env` has: `VITE_API_BASE_URL=http://localhost:5000/api`

**Port already in use?**
- Backend: Change `PORT=5000` to another port in `backend/.env`
- Frontend: Vite will automatically use next available port







