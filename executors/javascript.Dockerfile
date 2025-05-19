FROM node:20-slim

WORKDIR /code

# Install dependencies for secure JS execution
RUN npm init -y && \
    npm install vm2

# Set security limits
ENV NODE_OPTIONS="--max-old-space-size=128 --max-http-header-size=8192"

# When the container starts, it just waits for commands
# Your javascriptExecutor.ts will use "docker exec" to run specific JS files
CMD ["tail", "-f", "/dev/null"]