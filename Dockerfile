# Stage 1: Build Frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

# Copy backend files
COPY server.js ./
COPY src/services ./src/services
COPY data ./data

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "server.js"]
