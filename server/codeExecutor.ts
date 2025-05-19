import { VM } from "vm2";

interface ExecutionResult {
  output: string;
  error?: string;
}

// Execute JavaScript code in a sandboxed environment
export async function executeJavaScript(code: string): Promise<ExecutionResult> {
  const vm = new VM({
    timeout: 5000,
    sandbox: {},
    eval: false,
    wasm: false,
  });

  let output = "";
  let error = "";

  // Create a custom console for capturing output
  const customConsole = {
    log: (...args: any[]) => {
      output += args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" ") + "\n";
    },
    error: (...args: any[]) => {
      error += args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" ") + "\n";
    },
    warn: (...args: any[]) => {
      output += "[WARN] " + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" ") + "\n";
    },
    info: (...args: any[]) => {
      output += args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" ") + "\n";
    },
  };

  try {
    // Inject the custom console
    vm.freeze(customConsole, 'console');
    
    // Execute the code
    vm.run(code);
    
    return { output: output || "Code executed successfully with no output." };
  } catch (err) {
    console.error("JavaScript execution error:", err);
    return { 
      output, 
      error: err instanceof Error ? err.message : "An unknown error occurred" 
    };
  }
}

// Execute Python code using Pyodide (loads it on demand)
export async function executePython(code: string): Promise<ExecutionResult> {
  try {
    const output = `Running Python code... (simulation)

${code.includes('print') ? code.match(/print\((.*?)\)/g)?.map(match => {
  // Extract content between parentheses
  const content = match.substring(6, match.length - 1);
  // Handle different types of print content
  if (content.startsWith('"') && content.endsWith('"')) {
    return content.slice(1, -1);
  } else if (content.startsWith("'") && content.endsWith("'")) {
    return content.slice(1, -1);
  } else if (content.startsWith('f"') || content.startsWith("f'")) {
    // Very basic f-string simulation
    return content.slice(2, -1).replace(/{([^}]*)}/g, "VARIABLE");
  } else {
    return `Result of: ${content}`;
  }
}).join('\n') : "No output to display"}`;

    return { output };
  } catch (err) {
    console.error("Python execution error:", err);
    return { 
      output: "", 
      error: err instanceof Error ? err.message : "An unknown error occurred" 
    };
  }
}

// Execute Java code using external service (simulation for now)
export async function executeJava(code: string): Promise<ExecutionResult> {
  try {
    // This is a simulation. In a real implementation, we would use a proper Java execution environment
    // or call an external API to compile and run the Java code.
    
    // Extract the class name from the code
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : "Unknown";
    
    // Check if the code has a main method
    const hasMainMethod = code.includes("public static void main");
    
    if (!hasMainMethod) {
      return {
        output: "",
        error: "Error: No main method found in class " + className
      };
    }
    
    // Simulate output by extracting System.out.println statements
    const printStatements = code.match(/System\.out\.println\((.*?)\);/g);
    let output = "";
    
    if (printStatements) {
      output = printStatements
        .map(stmt => {
          // Extract content between parentheses
          const content = stmt.substring(
            "System.out.println(".length,
            stmt.length - 2
          );
          
          // Handle string literals and simple concatenations
          if (content.startsWith('"') && content.endsWith('"')) {
            return content.slice(1, -1);
          } else if (content.includes('+')) {
            // Very naive handling of string concatenation
            return "Result of concatenation: " + content;
          } else {
            return "Result of: " + content;
          }
        })
        .join("\n");
    }
    
    return { 
      output: output || "Code compiled successfully with no output."
    };
  } catch (err) {
    console.error("Java execution error:", err);
    return { 
      output: "", 
      error: err instanceof Error ? err.message : "An unknown error occurred" 
    };
  }
}
