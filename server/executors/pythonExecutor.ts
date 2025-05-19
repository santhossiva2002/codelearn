// import { ExecutionResult } from "@/types";

// // Uses Pyodide for Python execution (client-side)
// export async function executePython(code: string): Promise<ExecutionResult> {
//   try {
//     // For security reasons, we'll handle Python execution on the client side
//     // using Pyodide. This is a placeholder that returns a message to the client.
//     return {
//       output: "Python execution will be handled by Pyodide in the browser for security.",
//       isError: false
//     };
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : String(err);
//     return {
//       output: "",
//       error: errorMessage,
//       isError: true
//     };
//   }
// }

// import fs from 'fs/promises';
// import path from 'path';
// import { exec } from 'child_process';
// import { promisify } from 'util';
// import { ExecutionResult } from '../../client/src/types';

// const execPromise = promisify(exec);

// // Check if Docker is running
// async function isDockerAvailable(): Promise<boolean> {
//   try {
//     await execPromise('docker ps');
//     return true;
//   } catch (error) {
//     console.log('Docker is not available:', error);
//     return false;
//   }
// }

// // Check if the python-executor container is running
// async function isPythonExecutorRunning(): Promise<boolean> {
//   try {
//     const { stdout } = await execPromise('docker ps --format "{{.Names}}" | grep python-executor');
//     return stdout.includes('python-executor');
//   } catch (error) {
//     return false;
//   }
// }

// export async function executePython(code: string): Promise<ExecutionResult> {
//   try {
//     // Create a temporary directory for execution
//     const tempDir = path.resolve('temp');
//     await fs.mkdir(tempDir, { recursive: true });

//     // Create a temporary file with the code
//     const timestamp = Date.now();
//     const filename = `python_execution_${timestamp}.py`;
//     const filePath = path.join(tempDir, filename);
    
//     await fs.writeFile(filePath, code);
    
//     const startTime = Date.now();
    
//     // Determine whether to use Docker or local execution
//     const dockerAvailable = await isDockerAvailable();
//     const pythonExecutorRunning = await isPythonExecutorRunning();
    
//     if (dockerAvailable && pythonExecutorRunning) {
//       console.log('Using Docker python-executor container for code execution');
//       return await executeInDocker(filename, filePath, startTime);
//     } else {
//       console.log('Falling back to local Python execution');
//       return await executeLocally(filePath, startTime);
//     }
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : String(err);
//     return {
//       output: '',
//       error: errorMessage,
//       isError: true
//     };
//   }
// }

// // Execute Python code in the Docker container
// async function executeInDocker(
//   filename: string, 
//   filePath: string,
//   startTime: number
// ): Promise<ExecutionResult> {
//   try {
//     // Create a container if it doesn't exist yet
//     try {
//       // Check if container exists but is not running
//       const { stdout: containerExists } = await execPromise('docker ps -a --format "{{.Names}}" | grep python-executor');
      
//       if (containerExists && !await isPythonExecutorRunning()) {
//         // Start the stopped container
//         await execPromise('docker start python-executor');
//         console.log('Started existing python-executor container');
//       }
//     } catch (error) {
//       // Container doesn't exist, create it from the docker-compose config
//       console.log('Python executor container does not exist, would create it in production');
//     }

//     // Ensure code file is accessible to the container
//     // In a real setup, the /temp directory would be mounted as a volume

//     // Step 1: Copy the Python file to the container
//     await execPromise(`docker cp ${filePath} python-executor:/code/${filename}`);
    
//     // Step 2: Run the Python code in the container
//     const { stdout, stderr } = await execPromise(`docker exec python-executor python3 /code/${filename}`, {
//       timeout: 30000
//     }).catch(error => {
//       return { 
//         stdout: '',
//         stderr: error instanceof Error ? error.message : String(error)
//       };
//     });
    
//     const executionTime = Date.now() - startTime;
    
//     // Step 3: Clean up files in the container
//     await execPromise(`docker exec python-executor rm -f /code/${filename}`).catch(() => {});
    
//     // Also clean up local files
//     await fs.unlink(filePath).catch(() => {});
    
//     if (stderr) {
//       return {
//         output: '',
//         error: stderr,
//         isError: true,
//         executionTime
//       };
//     }
    
//     return {
//       output: stdout,
//       isError: false,
//       executionTime
//     };
//   } catch (error) {
//     // Clean up local files
//     await fs.unlink(filePath).catch(() => {});
    
//     const errorMsg = error instanceof Error ? error.message : String(error);
//     return {
//       output: '',
//       error: `Docker execution error: ${errorMsg}`,
//       isError: true
//     };
//   }
// }

// // Execute Python code locally (fallback when Docker is not available)
// async function executeLocally(
//   filePath: string, 
//   startTime: number
// ): Promise<ExecutionResult> {
//   try {
//     // Execute the code with timeout and memory limitations
//     const { stdout, stderr } = await execPromise(`python3 ${filePath}`, {
//       timeout: 30000, // 30 seconds timeout
//       maxBuffer: 1024 * 1024 // 1MB output buffer
//     });
    
//     const executionTime = Date.now() - startTime;
    
//     // Clean up the temporary file
//     await fs.unlink(filePath).catch(() => {});
    
//     if (stderr) {
//       return {
//         output: '',
//         error: stderr,
//         isError: true,
//         executionTime
//       };
//     }
    
//     return {
//       output: stdout,
//       isError: false,
//       executionTime
//     };
//   } catch (error) {
//     // Clean up files
//     await fs.unlink(filePath).catch(() => {});
    
//     const errorMsg = error instanceof Error ? error.message : String(error);
//     return {
//       output: '',
//       error: `Execution error: ${errorMsg}`,
//       isError: true
//     };
//   }
// }

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ExecutionResult } from '../../client/src/types';

const execPromise = promisify(exec);

// Check if Docker is running
async function isDockerAvailable(): Promise<boolean> {
  try {
    await execPromise('docker ps', { timeout: 5000 });
    return true;
  } catch (error) {
    console.log('Docker is not available or command timed out:', error);
    return false;
  }
}

// Helper: Get the running container name for Python executor
async function getPythonExecutorContainerName(): Promise<string | null> {
  try {
    // Get all container names
    const { stdout } = await execPromise('docker ps --format "{{.Names}}"');
    
    // Split by newlines and find python-executor container
    const containerNames = stdout.trim().split('\n');
    const pythonContainer = containerNames.find(name => 
      name.toLowerCase().includes('python-executor')
    );
    
    console.log("Found Python executor container:", pythonContainer);
    return pythonContainer || null;
  } catch (error) {
    console.error("Error getting Python executor container name:", error);
    return null;
  }
}

// Check if Python executor container is running
async function isPythonExecutorRunning(): Promise<boolean> {
  const containerName = await getPythonExecutorContainerName();
  return containerName !== null;
}
export async function executePython(code: string): Promise<ExecutionResult> {
  try {
    // Create a temporary directory for execution
    const tempDir = path.resolve('temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Create a temporary file with the code
    const timestamp = Date.now();
    const filename = `python_execution_${timestamp}.py`;
    const filePath = path.join(tempDir, filename);
    
    await fs.writeFile(filePath, code);
    
    const startTime = Date.now();
    
    // Determine whether to use Docker or local execution
    const dockerAvailable = await isDockerAvailable();
    const pythonExecutorRunning = await isPythonExecutorRunning();
    
    if (dockerAvailable && pythonExecutorRunning) {
      console.log('Using Docker python-executor container for code execution');
      return await executeInDocker(filename, filePath, startTime);
    } else {
      console.log('Falling back to local Python execution');
      return await executeLocally(filePath, startTime);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      output: '',
      error: errorMessage,
      isError: true
    };
  }
}

// Modify executeInDocker to use the container name
async function executeInDocker(
  filename: string, 
  filePath: string,
  startTime: number
): Promise<ExecutionResult> {
  try {
    // Get the container name
    const containerName = await getPythonExecutorContainerName();
    if (!containerName) {
      console.log('Python executor container not found');
      throw new Error('Python executor container not found');
    }

    // Copy the Python file to the container
    await execPromise(`docker cp ${filePath} ${containerName}:/code/${filename}`);
    
    // Run the Python code in the container
    const { stdout, stderr } = await execPromise(`docker exec ${containerName} python3 /code/${filename}`, {
      timeout: 30000
    }).catch(error => {
      return { 
        stdout: '',
        stderr: error instanceof Error ? error.message : String(error)
      };
    });
    
    const executionTime = Date.now() - startTime;
    
    // Clean up files in the container
    await execPromise(`docker exec ${containerName} rm -f /code/${filename}`).catch(() => {});
    
    // Also clean up local files
    await fs.unlink(filePath).catch(() => {});
    
    if (stderr) {
      return {
        output: '',
        error: stderr,
        isError: true,
        executionTime
      };
    }
    
    return {
      output: stdout,
      isError: false,
      executionTime
    };
  } catch (error) {
    // Clean up local files
    await fs.unlink(filePath).catch(() => {});
    
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      output: '',
      error: `Docker execution error: ${errorMsg}`,
      isError: true
    };
  }
}
// Execute Python code locally (fallback when Docker is not available)
async function executeLocally(
  filePath: string, 
  startTime: number
): Promise<ExecutionResult> {
  try {
    // Execute the code with timeout and memory limitations
    const { stdout, stderr } = await execPromise(`python3 ${filePath}`, {
      timeout: 30000, // 30 seconds timeout
      maxBuffer: 1024 * 1024 // 1MB output buffer
    });
    
    const executionTime = Date.now() - startTime;
    
    // Clean up the temporary file
    await fs.unlink(filePath).catch(() => {});
    
    if (stderr) {
      return {
        output: '',
        error: stderr,
        isError: true,
        executionTime
      };
    }
    
    return {
      output: stdout,
      isError: false,
      executionTime
    };
  } catch (error) {
    // Clean up files
    await fs.unlink(filePath).catch(() => {});
    
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      output: '',
      error: `Execution error: ${errorMsg}`,
      isError: true
    };
  }
}
