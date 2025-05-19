FROM python:3.11-slim

WORKDIR /code

# Install dependencies for secure Python execution
RUN pip install restrictedpython pyseccomp

# Create a non-root user for security
RUN useradd -m codeuser

# Set resource limits
ENV PYTHONMEMORY=128M

# Switch to non-root user for security
USER codeuser

# When the container starts, it just waits for commands
# Your pythonExecutor.ts will use "docker exec" to run specific Python files
CMD ["tail", "-f", "/dev/null"]