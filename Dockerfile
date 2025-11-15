# Multi-stage build for full-stack application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json files
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy source code for development
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Skip user creation - running as root for simplicity

# Set working directory
WORKDIR /app

# Copy dependencies and source code
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend ./backend/
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /app/frontend ./frontend/

# Copy startup script
COPY start-dev.sh ./
RUN chmod +x start-dev.sh

# Expose port for frontend dev server (Render will set PORT env var)
EXPOSE 5173
ENV PORT=5173

# Health check for frontend dev server
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start both backend and frontend dev servers
ENTRYPOINT ["dumb-init", "--"]
CMD ["./start-dev.sh"]
