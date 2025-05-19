// import { ExecutionResult } from "@/types";

// // Java execution via a third-party API (placeholder)
// export async function executeJava(code: string): Promise<ExecutionResult> {
//   try {
//     // For security reasons, we'll use a third-party API for Java execution
//     // This is a placeholder that returns a message to the client
//     return {
//       output: "Java execution will be handled by a third-party API for security.",
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

// // Check if Docker is running and the container exists
// async function isDockerAvailable(): Promise<boolean> {
//   try {
//     await execPromise('docker ps');
//     return true;
//   } catch (error) {
//     console.log('Docker is not available:', error);
//     return false;
//   }
// }

// // Check if the java-executor container is running
// async function isJavaExecutorRunning(): Promise<boolean> {
//   try {
//     const { stdout } = await execPromise('docker ps --format "{{.Names}}" | grep java-executor');
//     return stdout.includes('java-executor');
//   } catch (error) {
//     return false;
//   }
// }

// export async function executeJava(code: string): Promise<ExecutionResult> {
//   try {
//     // Create a temporary directory for execution
//     const tempDir = path.resolve('temp');
//     await fs.mkdir(tempDir, { recursive: true });

//     // Parse the class name from the code
//     const classNameMatch = code.match(/public\s+class\s+(\w+)/);
//     if (!classNameMatch) {
//       return {
//         output: '',
//         error: 'Could not find a public class in the Java code.',
//         isError: true
//       };
//     }

//     const className = classNameMatch[1];
//     const javaFilename = `${className}.java`;
//     const javaFilePath = path.join(tempDir, javaFilename);
    
//     // Write the Java file
//     await fs.writeFile(javaFilePath, code);
    
//     const startTime = Date.now();

//     // Determine whether to use Docker or local execution
//     const dockerAvailable = await isDockerAvailable();
//     const javaExecutorRunning = await isJavaExecutorRunning();
    
//     if (dockerAvailable && javaExecutorRunning) {
//       console.log('Using Docker java-executor container for code execution');
//       return await executeInDocker(className, javaFilename, javaFilePath, tempDir, startTime);
//     } else {
//       console.log('Falling back to local Java execution');
//       return await executeLocally(className, javaFilePath, tempDir, startTime);
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

// // Execute Java code in the Docker container
// async function executeInDocker(
//   className: string, 
//   javaFilename: string, 
//   javaFilePath: string, 
//   tempDir: string, 
//   startTime: number
// ): Promise<ExecutionResult> {
//   try {
//     // Create a container if it doesn't exist yet
//     try {
//       // Check if container exists but is not running
//       const { stdout: containerExists } = await execPromise('docker ps -a --format "{{.Names}}" | grep java-executor');
      
//       if (containerExists && !await isJavaExecutorRunning()) {
//         // Start the stopped container
//         await execPromise('docker start java-executor');
//         console.log('Started existing java-executor container');
//       }
//     } catch (error) {
//       // Container doesn't exist, create it from the docker-compose config
//       console.log('Java executor container does not exist, would create it in production');
//     }

//     // Ensure code file is accessible to the container
//     // In a real setup, the /temp directory would be mounted as a volume

//     // Step 1: Copy the Java file to the container
//     await execPromise(`docker cp ${javaFilePath} java-executor:/code/${javaFilename}`);
    
//     // Step 2: Compile the Java code in the container
//     const compileResult = await execPromise(`docker exec java-executor javac /code/${javaFilename}`, {
//       timeout: 30000
//     }).catch(error => {
//       return { error };
//     });
    
//     if ('error' in compileResult) {
//       const errorMsg = compileResult.error instanceof Error 
//         ? compileResult.error.message 
//         : String(compileResult.error);
      
//       // Clean up by removing the source file
//       await execPromise(`docker exec java-executor rm -f /code/${javaFilename}`).catch(() => {});
      
//       return {
//         output: '',
//         error: `Compilation error: ${errorMsg}`,
//         isError: true
//       };
//     }
    
//     // Step 3: Run the compiled Java code
//     const { stdout, stderr } = await execPromise(`docker exec java-executor java -cp /code ${className}`, {
//       timeout: 30000
//     }).catch(error => {
//       return { 
//         stdout: '',
//         stderr: error instanceof Error ? error.message : String(error)
//       };
//     });
    
//     const executionTime = Date.now() - startTime;
    
//     // Step 4: Clean up files in the container
//     await execPromise(`docker exec java-executor rm -f /code/${javaFilename} /code/${className}.class`).catch(() => {});
    
//     // Also clean up local files
//     await fs.unlink(javaFilePath).catch(() => {});
    
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
//     await fs.unlink(javaFilePath).catch(() => {});
    
//     const errorMsg = error instanceof Error ? error.message : String(error);
//     return {
//       output: '',
//       error: `Docker execution error: ${errorMsg}`,
//       isError: true
//     };
//   }
// }

// // Execute Java code locally (fallback when Docker is not available)
// async function executeLocally(
//   className: string, 
//   javaFilePath: string, 
//   tempDir: string, 
//   startTime: number
// ): Promise<ExecutionResult> {
//   try {
//     // Step 1: Compile the Java code
//     await execPromise(`javac ${javaFilePath}`, {
//       timeout: 30000,
//       maxBuffer: 1024 * 1024
//     });
    
//     // Step 2: Run the compiled Java code
//     const { stdout, stderr } = await execPromise(`java -cp ${tempDir} ${className}`, {
//       timeout: 30000,
//       maxBuffer: 1024 * 1024
//     });
    
//     const executionTime = Date.now() - startTime;
    
//     // Clean up files
//     await fs.unlink(javaFilePath).catch(() => {});
//     await fs.unlink(path.join(tempDir, `${className}.class`)).catch(() => {});
    
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
//     await fs.unlink(javaFilePath).catch(() => {});
    
//     const errorMsg = error instanceof Error ? error.message : String(error);
    
//     // Determine if this is a compilation or runtime error
//     if (errorMsg.includes('javac')) {
//       return {
//         output: '',
//         error: `Compilation error: ${errorMsg}`,
//         isError: true
//       };
//     } else {
//       return {
//         output: '',
//         error: `Runtime error: ${errorMsg}`,
//         isError: true
//       };
//     }
//   }
// }

// import fs from 'fs/promises';
// import path from 'path';
// import { exec } from 'child_process';
// import { promisify } from 'util';
// import { ExecutionResult } from '../../client/src/types';

// const execPromise = promisify(exec);

// // Check if Docker is running and the container exists
// async function isDockerAvailable(): Promise<boolean> {
//   try {
//     await execPromise('docker ps', { timeout: 5000 });
//     return true;
//   } catch (error) {
//     console.log('Docker is not available or command timed out:', error);
//     return false;
//   }
// }

// // Check if the java-executor container is running
// async function isJavaExecutorRunning(): Promise<boolean> {
//   try {
//     const { stdout } = await execPromise('docker ps --format "{{.Names}}" | grep java-executor');
//     return stdout.includes('java-executor');
//   } catch (error) {
//     return false;
//   }
// }

// export async function executeJava(code: string): Promise<ExecutionResult> {
//   try {
    // // Create a temporary directory for execution
    // const tempDir = path.resolve('temp');
    // await fs.mkdir(tempDir, { recursive: true });

    // // Parse the class name from the code
    // const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    // if (!classNameMatch) {
    //   return {
    //     output: '',
    //     error: 'Could not find a public class in the Java code.',
    //     isError: true
    //   };
    // }

    // const className = classNameMatch[1];
    // const javaFilename = `${className}.java`;
    // const javaFilePath = path.join(tempDir, javaFilename);
    
    // // Write the Java file
    // await fs.writeFile(javaFilePath, code);
    
    // const startTime = Date.now();

//     // Determine whether to use Docker or local execution
//     const dockerAvailable = await isDockerAvailable();
//     const javaExecutorRunning = await isJavaExecutorRunning();
    
//     if (dockerAvailable && javaExecutorRunning) {
//       console.log('Using Docker java-executor container for code execution');
//       return await executeInDocker(className, javaFilename, javaFilePath, tempDir, startTime);
//     } else {
//       console.log('Falling back to local Java execution');
//       return await executeLocally(className, javaFilePath, tempDir, startTime);
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

// // Execute Java code in the Docker container
// async function executeInDocker(
//   className: string, 
//   javaFilename: string, 
//   javaFilePath: string, 
//   tempDir: string, 
//   startTime: number
// ): Promise<ExecutionResult> {
//   try {
//     // Create a container if it doesn't exist yet
//     try {
//       // Check if container exists but is not running
//       const { stdout: containerExists } = await execPromise('docker ps -a --format "{{.Names}}" | grep java-executor');
      
//       if (containerExists && !await isJavaExecutorRunning()) {
//         // Start the stopped container
//         await execPromise('docker start java-executor');
//         console.log('Started existing java-executor container');
//       }
//     } catch (error) {
//       // Container doesn't exist, create it from the docker-compose config
//       console.log('Java executor container does not exist, would create it in production');
//     }

//     // Ensure code file is accessible to the container
//     // In a real setup, the /temp directory would be mounted as a volume

//     // Step 1: Copy the Java file to the container
//     await execPromise(`docker cp ${javaFilePath} java-executor:/code/${javaFilename}`);
    
//     // Step 2: Compile the Java code in the container
//     const compileResult = await execPromise(`docker exec java-executor javac /code/${javaFilename}`, {
//       timeout: 30000
//     }).catch(error => {
//       return { error };
//     });
    
//     if ('error' in compileResult) {
//       const errorMsg = compileResult.error instanceof Error 
//         ? compileResult.error.message 
//         : String(compileResult.error);
      
//       // Clean up by removing the source file
//       await execPromise(`docker exec java-executor rm -f /code/${javaFilename}`).catch(() => {});
      
//       return {
//         output: '',
//         error: `Compilation error: ${errorMsg}`,
//         isError: true
//       };
//     }
    
//     // Step 3: Run the compiled Java code
//     const { stdout, stderr } = await execPromise(`docker exec java-executor java -cp /code ${className}`, {
//       timeout: 30000
//     }).catch(error => {
//       return { 
//         stdout: '',
//         stderr: error instanceof Error ? error.message : String(error)
//       };
//     });
    
//     const executionTime = Date.now() - startTime;
    
//     // Step 4: Clean up files in the container
//     await execPromise(`docker exec java-executor rm -f /code/${javaFilename} /code/${className}.class`).catch(() => {});
    
//     // Also clean up local files
//     await fs.unlink(javaFilePath).catch(() => {});
    
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
//     await fs.unlink(javaFilePath).catch(() => {});
    
//     const errorMsg = error instanceof Error ? error.message : String(error);
//     return {
//       output: '',
//       error: `Docker execution error: ${errorMsg}`,
//       isError: true
//     };
//   }
// }

// // Execute Java code locally (fallback when Docker is not available)
// async function executeLocally(
//   className: string, 
//   javaFilePath: string, 
//   tempDir: string, 
//   startTime: number
// ): Promise<ExecutionResult> {
//   try {
//     // Step 1: Compile the Java code
//     await execPromise(`javac ${javaFilePath}`, {
//       timeout: 30000,
//       maxBuffer: 1024 * 1024
//     });
    
//     // Step 2: Run the compiled Java code
//     const { stdout, stderr } = await execPromise(`java -cp ${tempDir} ${className}`, {
//       timeout: 30000,
//       maxBuffer: 1024 * 1024
//     });
    
//     const executionTime = Date.now() - startTime;
    
//     // Clean up files
//     await fs.unlink(javaFilePath).catch(() => {});
//     await fs.unlink(path.join(tempDir, `${className}.class`)).catch(() => {});
    
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
//     await fs.unlink(javaFilePath).catch(() => {});
    
//     const errorMsg = error instanceof Error ? error.message : String(error);
    
//     // Determine if this is a compilation or runtime error
//     if (errorMsg.includes('javac')) {
//       return {
//         output: '',
//         error: `Compilation error: ${errorMsg}`,
//         isError: true
//       };
//     } else {
//       return {
//         output: '',
//         error: `Runtime error: ${errorMsg}`,
//         isError: true
//       };
//     }
//   }
// }

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ExecutionResult } from '../../client/src/types';

const execPromise = promisify(exec);

// Helper: Get the running container name for java executor (contains 'java-executor')
async function getJavaExecutorContainerName(): Promise<string | null> {
  try {
    // Get all container names
    const { stdout } = await execPromise('docker ps --format "{{.Names}}"');
    
    // Split by newlines and find java-executor container
    const containerNames = stdout.trim().split('\n');
    const javaContainer = containerNames.find(name => 
      name.toLowerCase().includes('java-executor')
    );
    
    console.log("Found Java executor container:", javaContainer);
    return javaContainer || null;
  } catch (error) {
    console.error("Error getting Java executor container name:", error);
    return null;
  }
}

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

// Check if Java executor container is running
async function isJavaExecutorRunning(): Promise<boolean> {
  const containerName = await getJavaExecutorContainerName();
  return containerName !== null;
}

export async function executeJava(code: string): Promise<ExecutionResult> {
  try {
       // Create a temporary directory for execution
       const tempDir = path.resolve('temp');
       await fs.mkdir(tempDir, { recursive: true });
   
       // Parse the class name from the code
       const classNameMatch = code.match(/public\s+class\s+(\w+)/);
       if (!classNameMatch) {
         return {
           output: '',
           error: 'Could not find a public class in the Java code.',
           isError: true
         };
       }
   
       const className = classNameMatch[1];
       const javaFilename = `${className}.java`;
       const javaFilePath = path.join(tempDir, javaFilename);
       
       // Write the Java file
       await fs.writeFile(javaFilePath, code);
       
       const startTime = Date.now();

    const dockerAvailable = await isDockerAvailable();
    const javaExecutorRunning = await isJavaExecutorRunning();
    
    if (dockerAvailable && javaExecutorRunning) {
      console.log('Using Docker java-executor container for code execution');
      const containerName = await getJavaExecutorContainerName();
      if (!containerName) {
        throw new Error('Java executor container not found');
      }
      return await executeInDocker(containerName, className, javaFilename, javaFilePath, tempDir, startTime);
    } else {
      console.log('Falling back to local Java execution');
      return await executeLocally(className, javaFilePath, tempDir, startTime);
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

// Update executeInDocker to accept containerName dynamically
async function executeInDocker(
  containerName: string,
  className: string, 
  javaFilename: string, 
  javaFilePath: string, 
  tempDir: string, 
  startTime: number
): Promise<ExecutionResult> {
  try {
    // Start container if stopped
    try {
      const { stdout: containerExists } = await execPromise(`docker ps -a --format "{{.Names}}" | grep ${containerName}`);
      
      if (containerExists && !(await isJavaExecutorRunning())) {
        await execPromise(`docker start ${containerName}`);
        console.log(`Started existing ${containerName} container`);
      }
    } catch (error) {
      console.log(`${containerName} container does not exist, would create it in production`);
    }

    // Copy the Java file to the container
    await execPromise(`docker cp ${javaFilePath} ${containerName}:/code/${javaFilename}`);
    
    // Compile
    const compileResult = await execPromise(`docker exec ${containerName} javac /code/${javaFilename}`, {
      timeout: 30000
    }).catch(error => ({ error }));

    if ('error' in compileResult) {
      const errorMsg = compileResult.error instanceof Error 
        ? compileResult.error.message 
        : String(compileResult.error);
      await execPromise(`docker exec ${containerName} rm -f /code/${javaFilename}`).catch(() => {});
      return {
        output: '',
        error: `Compilation error: ${errorMsg}`,
        isError: true
      };
    }
    
    // Run the Java code
    const { stdout, stderr } = await execPromise(`docker exec ${containerName} java -cp /code ${className}`, {
      timeout: 30000
    }).catch(error => ({
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error)
    }));
    
    const executionTime = Date.now() - startTime;
    
    // Clean up in container
    await execPromise(`docker exec ${containerName} rm -f /code/${javaFilename} /code/${className}.class`).catch(() => {});
    // Clean up local
    await fs.unlink(javaFilePath).catch(() => {});
    
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
    await fs.unlink(javaFilePath).catch(() => {});
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      output: '',
      error: `Docker execution error: ${errorMsg}`,
      isError: true
    };
  }
}


// Execute Java code locally (fallback when Docker is not available)
async function executeLocally(
  className: string, 
  javaFilePath: string, 
  tempDir: string, 
  startTime: number
): Promise<ExecutionResult> {
  try {
    // Step 1: Compile the Java code
    await execPromise(`javac ${javaFilePath}`, {
      timeout: 30000,
      maxBuffer: 1024 * 1024
    });
    
    // Step 2: Run the compiled Java code
    const { stdout, stderr } = await execPromise(`java -cp ${tempDir} ${className}`, {
      timeout: 30000,
      maxBuffer: 1024 * 1024
    });
    
    const executionTime = Date.now() - startTime;
    
    // Clean up files
    await fs.unlink(javaFilePath).catch(() => {});
    await fs.unlink(path.join(tempDir, `${className}.class`)).catch(() => {});
    
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
    await fs.unlink(javaFilePath).catch(() => {});
    
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    // Determine if this is a compilation or runtime error
    if (errorMsg.includes('javac')) {
      return {
        output: '',
        error: `Compilation error: ${errorMsg}`,
        isError: true
      };
    } else {
      return {
        output: '',
        error: `Runtime error: ${errorMsg}`,
        isError: true
      };
    }
  }
}
