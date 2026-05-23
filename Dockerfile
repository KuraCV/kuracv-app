# Use Node.js as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of your app's source code
COPY . .

# Accept build arguments for environment variables
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Build the Next.js application
RUN npm run build

# Copy and set up the entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose the port Next.js runs on
EXPOSE 3000

# Use the entrypoint script to generate runtime config
ENTRYPOINT ["/app/docker-entrypoint.sh"]