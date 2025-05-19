FROM node:20-slim

WORKDIR /app

# Set non-interactive mode for apt
ENV DEBIAN_FRONTEND=noninteractive

# Add more reliable package repositories and retry logic for better reliability
RUN apt-get update -y || (sleep 2 && apt-get update -y) || (sleep 5 && apt-get update -y) && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    python3 \
    python3-pip \
    default-jdk \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

# Copy package.json and install dependencies with retry logic
COPY package*.json ./
RUN npm install || (sleep 2 && npm install) || (sleep 5 && npm install)

# Copy all application files
COPY . .

# Build the application with retry logic
RUN npm run build || (sleep 2 && npm run build) || (sleep 5 && npm run build)

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["npm", "start"]