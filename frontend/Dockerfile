# frontend/Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./pnpm-lock.yaml 2>/dev/null || :

# Install dependencies with pnpm (without frozen-lockfile if lock file doesn't exist)
RUN pnpm install

# Copy all source files
COPY . .

# Build the application
RUN pnpm run build

# Production stage - serve with lightweight server
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]