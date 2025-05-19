# CodeLearn Project Build Prompt

## Project Overview

Create a beginner-friendly online code editor called "CodeLearn" targeting young learners (10-18 years old). The editor should support multiple programming languages (JavaScript, Python, and Java at minimum), allowing users to write, execute, and save code without authentication requirements. The interface should be intuitive, clean, and distraction-free.

## Key Features

1. **Multi-language Support**:
   - Code editor with syntax highlighting for JavaScript, Python, and Java
   - Language-specific code execution
   - Easy language switching with appropriate templates

2. **Code Editor**:
   - Monaco Editor integration with syntax highlighting
   - Adjustable font size
   - Line numbers and proper indentation
   - Light and dark theme support

3. **Code Execution**:
   - Secure sandboxed execution environment for each language
   - Clear output display (stdout, stderr)
   - Support for basic input/output operations
   - Visual indication of running status

4. **File Management**:
   - Create new files with language-specific templates
   - Save files to browser memory
   - Load local files from computer
   - Download files to local system
   - File listing in sidebar with language icons

5. **User Interface**:
   - Clean, modern design with ShadCN UI components
   - Responsive layout for desktop and tablet use
   - Resizable editor and output panels
   - Keyboard shortcuts for common actions (e.g., Ctrl+Enter to run)
   - Theme toggle (light/dark mode)

6. **Learning Resources**:
   - Built-in example code for each language
   - Links to language documentation
   - Helpful tooltips for beginners

## Technical Requirements

1. **Frontend**:
   - React with TypeScript
   - Monaco Editor for code editing
   - ShadCN UI components with Tailwind CSS 
   - Responsive design with mobile support

2. **Backend**:
   - Express.js server
   - In-memory storage with persistence
   - Secure code execution services for each language
   - RESTful API for code operations

3. **Code Execution**:
   - JavaScript: VM2 for sandboxed execution
   - Python: Restricted Python environment
   - Java: Security Manager with JVM restrictions
   - Resource limitations (memory, CPU, execution time)

4. **Docker Integration**:
   - Docker support for local deployment
   - Separate containers for language execution
   - Docker Compose for orchestration
   - Security measures for code isolation

## Architecture

1. The application should have a client-server architecture:
   - Frontend React app communicates with backend via REST API
   - Backend handles code execution and file storage
   - Each language has a dedicated execution service

2. The user interface should feature:
   - Header with language selector and file operations
   - Sidebar with file listings and examples
   - Main editor area with Monaco Editor
   - Output panel for code execution results
   - Settings for theme and font size

3. For security:
   - Sandbox all code execution
   - Limit resource usage
   - Prevent file system access outside designated areas
   - Input validation on all API endpoints

## Implementation Guidelines

1. Start with the basic structure and UI components
2. Implement the code editor with Monaco integration
3. Set up the file management system with local storage
4. Add code execution capabilities for each language
5. Implement theme switching and UI customization
6. Create Docker support for secure execution
7. Add file operations (open/save local files)
8. Polish the UI for beginner-friendliness

## Constraints

- No authentication required
- Keep the interface simple and intuitive for young users
- Focus on core coding functionality rather than advanced features
- Ensure code execution is secure and resource-limited
- Support only the three main languages initially (JavaScript, Python, Java)