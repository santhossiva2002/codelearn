FROM openjdk:17-slim

WORKDIR /code

# Create a non-root user for security
RUN useradd -m codeuser

# Set memory limits
ENV JAVA_OPTS="-Xmx128m -XX:MaxRAM=128m"

# Switch to non-root user for security
USER codeuser

# When the container starts, it just waits for commands
# Your javaExecutor.ts will use "docker exec" to compile and run Java files
CMD ["tail", "-f", "/dev/null"]