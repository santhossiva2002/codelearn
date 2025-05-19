import { useState } from "react";
import { ExecutionResult, Language } from "@/types";
import { apiRequest } from "@/lib/queryClient";

export function useCodeExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const executeCode = async (code: string, language: Language) => {
    setIsExecuting(true);
    setResult(null);

    try {
      const response = await apiRequest("POST", "/api/execute", {
        code,
        language
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        output: "",
        error: error instanceof Error ? error.message : "An error occurred",
        isError: true
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const clearOutput = () => {
    setResult(null);
  };

  return {
    executeCode,
    clearOutput,
    isExecuting,
    result
  };
}
