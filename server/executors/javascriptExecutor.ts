// import { VM } from "vm2";
// import { ExecutionResult } from "@/types";

// export async function executeJavaScript(code: string): Promise<ExecutionResult> {
//   let output = "";
//   let error = "";

//   try {
//     // Create a sandboxed environment
//     const vm = new VM({
//       timeout: 5000, // 5 second timeout
//       sandbox: {
//         console: {
//           log: (...args: any[]) => {
//             output += args.map(arg => 
//               typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
//             ).join(" ") + "\n";
//           },
//           error: (...args: any[]) => {
//             output += args.map(arg => 
//               typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
//             ).join(" ") + "\n";
//           },
//           warn: (...args: any[]) => {
//             output += args.map(arg => 
//               typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
//             ).join(" ") + "\n";
//           },
//           info: (...args: any[]) => {
//             output += args.map(arg => 
//               typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
//             ).join(" ") + "\n";
//           }
//         },
//         setTimeout: (callback: Function, ms: number) => {
//           if (ms > 5000) ms = 5000; // Cap timeout at 5 seconds
//           return setTimeout(callback, ms);
//         },
//         setInterval: () => {
//           throw new Error("setInterval is not supported in the sandbox");
//         }
//       }
//     });

//     // Execute the code
//     vm.run(code);
    
//     return {
//       output: output.trim(),
//       isError: false
//     };
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : String(err);
//     return {
//       output: output.trim(),
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

// // Check if the js-executor container is running
// async function isJsExecutorRunning(): Promise<boolean> {
//   try {
//     const { stdout } = await execPromise('docker ps --format "{{.Names}}" | grep js-executor');
//     return stdout.includes('js-executor');
//   } catch (error) {
//     return false;
//   }
// }

// export async function executeJavaScript(code: string): Promise<ExecutionResult> {
//   try {
//     // Create a temporary directory for execution
//     const tempDir = path.resolve('temp');
//     await fs.mkdir(tempDir, { recursive: true });

//     // Create a temporary file with the code
//     const timestamp = Date.now();
//     const filename = `js_execution_${timestamp}.js`;
//     const filePath = path.join(tempDir, filename);
    
//     await fs.writeFile(filePath, code);
    
//     const startTime = Date.now();
    
//     // Determine whether to use Docker or local execution
//     const dockerAvailable = await isDockerAvailable();
//     const jsExecutorRunning = await isJsExecutorRunning();
    
//     if (dockerAvailable && jsExecutorRunning) {
//       console.log('Using Docker js-executor container for code execution');
//       return await executeInDocker(filename, filePath, startTime);
//     } else {
//       console.log('Falling back to local JavaScript execution');
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

// // Execute JavaScript code in the Docker container
// async function executeInDocker(
//   filename: string, 
//   filePath: string,
//   startTime: number
// ): Promise<ExecutionResult> {
//   try {
//     // Create a container if it doesn't exist yet
//     try {
//       // Check if container exists but is not running
//       const { stdout: containerExists } = await execPromise('docker ps -a --format "{{.Names}}" | grep js-executor');
      
//       if (containerExists && !await isJsExecutorRunning()) {
//         // Start the stopped container
//         await execPromise('docker start js-executor');
//         console.log('Started existing js-executor container');
//       }
//     } catch (error) {
//       // Container doesn't exist, create it from the docker-compose config
//       console.log('JavaScript executor container does not exist, would create it in production');
//     }

//     // Ensure code file is accessible to the container
//     // In a real setup, the /temp directory would be mounted as a volume

//     // Step 1: Copy the JavaScript file to the container
//     await execPromise(`docker cp ${filePath} js-executor:/code/${filename}`);
    
//     // Step 2: Run the JavaScript code in the container
//     const { stdout, stderr } = await execPromise(`docker exec js-executor node /code/${filename}`, {
//       timeout: 30000
//     }).catch(error => {
//       return { 
//         stdout: '',
//         stderr: error instanceof Error ? error.message : String(error)
//       };
//     });
    
//     const executionTime = Date.now() - startTime;
    
//     // Step 3: Clean up files in the container
//     await execPromise(`docker exec js-executor rm -f /code/${filename}`).catch(() => {});
    
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

// // Execute JavaScript code locally (fallback when Docker is not available)
// async function executeLocally(
//   filePath: string, 
//   startTime: number
// ): Promise<ExecutionResult> {
//   try {
//     // Execute the code with timeout and memory limitations
//     const { stdout, stderr } = await execPromise(`node ${filePath}`, {
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
    await execPromise('docker ps');
    return true;
  } catch (error) {
    console.log('Docker is not available:', error);
    return false;
  }
}

// Helper: Get the running container name for JavaScript executor
async function getJsExecutorContainerName(): Promise<string | null> {
  try {
    // Get all container names
    const { stdout } = await execPromise('docker ps --format "{{.Names}}"');
    
    // Split by newlines and find js-executor container
    const containerNames = stdout.trim().split('\n');
    const jsContainer = containerNames.find(name => 
      name.toLowerCase().includes('js-executor')
    );
    
    console.log("Found JavaScript executor container:", jsContainer);
    return jsContainer || null;
  } catch (error) {
    console.error("Error getting JavaScript executor container name:", error);
    return null;
  }
}
export async function executeJavaScript(code: string): Promise<ExecutionResult> {
  try {
    // Create a temporary directory for execution
    const tempDir = path.resolve('temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Create a temporary file with the code
    const timestamp = Date.now();
    const filename = `js_execution_${timestamp}.js`;
    const filePath = path.join(tempDir, filename);
    
    await fs.writeFile(filePath, code);
    
    const startTime = Date.now();
    
    // Determine whether to use Docker or local execution
    const dockerAvailable = await isDockerAvailable();
    const jsExecutorRunning = await isJsExecutorRunning();
    
    if (dockerAvailable && jsExecutorRunning) {
      console.log('Using Docker js-executor container for code execution');
      return await executeInDocker(filename, filePath, startTime);
    } else {
      console.log('Falling back to local JavaScript execution');
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
// Check if JavaScript executor container is running
async function isJsExecutorRunning(): Promise<boolean> {
  const containerName = await getJsExecutorContainerName();
  return containerName !== null;
}

// Modify executeInDocker to use the container name
async function executeInDocker(
  filename: string, 
  filePath: string,
  startTime: number
): Promise<ExecutionResult> {
  try {
    // Get the container name
    const containerName = await getJsExecutorContainerName();
    if (!containerName) {
      console.log('JavaScript executor container not found');
      throw new Error('JavaScript executor container not found');
    }

    // Copy the JavaScript file to the container
    await execPromise(`docker cp ${filePath} ${containerName}:/code/${filename}`);
    
    // Run the JavaScript code in the container
    const { stdout, stderr } = await execPromise(`docker exec ${containerName} node /code/${filename}`, {
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

// Execute JavaScript code locally (fallback when Docker is not available)
async function executeLocally(
  filePath: string, 
  startTime: number
): Promise<ExecutionResult> {
  try {
    // Execute the code with timeout and memory limitations
    const { stdout, stderr } = await execPromise(`node ${filePath}`, {
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
