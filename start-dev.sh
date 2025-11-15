#!/bin/sh

# Use PORT environment variable from Render, fallback to 5173
export VITE_PORT=${PORT:-5173}

# Start backend in background
cd /app/backend && npm run dev &
BACKEND_PID=$!

# Start frontend with dynamic port
cd /app/frontend && npm run dev -- --port $VITE_PORT --host 0.0.0.0 &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
