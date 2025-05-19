# CodeLearn - Beginner-Friendly Online Code Editor

CodeLearn is a web-based code editor designed for beginners (ages 10-18) to learn and practice coding in multiple programming languages. It provides a clean, distraction-free interface without requiring authentication.

![CodeLearn Screenshot](https://i.imgur.com/placeholder.png)

## Features

- **Multiple Language Support**: Write and run code in JavaScript, Python, and Java
- **Real-time Code Execution**: Execute code and see results instantly
- **File Management**: Create, save, open, and download your code files
- **Syntax Highlighting**: Colorized code with language-specific formatting
- **Responsive Design**: Works on desktops, tablets, and mobile devices 
- **Light/Dark Mode**: Toggle between themes for comfortable coding
- **Font Size Control**: Adjust text size for better readability
- **Example Projects**: Built-in code samples to learn from

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/santhossiva2002/codelearn.git
   cd codelearn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### Docker Installation

CodeLearn can also be run using Docker for easier setup and secure code execution:

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. Access the application at:
   ```
   http://localhost:5000
   ```

## Architecture

CodeLearn uses a full-stack JavaScript architecture:

- **Frontend**: React with TypeScript
- **UI Components**: ShadCN UI with Tailwind CSS
- **Code Editor**: Monaco Editor (same as VS Code)
- **Backend**: Express.js server
- **Storage**: In-memory storage with local persistence
- **Code Execution**: Secure sandboxed environments

## Code Execution

Code execution happens in isolated environments:

- **JavaScript**: Executed using the VM2 sandbox
- **Python**: Runs in a restricted Python environment
- **Java**: Compiled and executed with security manager

When running locally with Docker, code execution is handled in separate containers for enhanced security.

## File Operations

CodeLearn provides several ways to work with code files:

- **New File**: Create a new file with the "+" button in the sidebar
- **Open**: Load files from your local computer
- **Save**: Store files in the application memory
- **Download**: Save files to your local device

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Monaco Editor for the code editing capabilities
- ShadCN UI for the beautiful interface components
- Tailwind CSS for styling
- Express.js for the backend server