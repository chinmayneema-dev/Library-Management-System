#!/bin/sh

# Use different ports to avoid conflicts
BACKEND_PORT=3000
FRONTEND_PORT=${PORT:-5173}

# Clear PORT for backend, use BACKEND_PORT instead
unset PORT
cd /app/backend && PORT=$BACKEND_PORT npm run dev &
BACKEND_PID=$!

# Set PORT back for frontend
export PORT=$FRONTEND_PORT
cd /app/frontend && npm run dev -- --port $FRONTEND_PORT --host 0.0.0.0 &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
