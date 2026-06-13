# ================================
# Stage 1: Build React app
# ================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files trước để cache node_modules
COPY package*.json ./
RUN npm ci

# Nhận API URL lúc build (Vite cần biết tại build-time)
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .
RUN npm run build

# ================================
# Stage 2: Serve với Nginx
# ================================
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
