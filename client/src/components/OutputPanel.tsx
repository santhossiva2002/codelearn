import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ExecutionResult } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OutputPanelProps {
  result: ExecutionResult | null;
  onClear: () => void;
  isExecuting: boolean;
}

export function OutputPanel({ result, onClear, isExecuting }: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current && result) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result]);
  
  // Format output with color coding
  const formatOutput = (text: string) => {
    return text.split("\n").map((line, index) => {
      // Return early if line is empty to avoid unnecessary spans
      if (!line) return <br key={index} />;
      
      return (
        <div key={index} className="text-green-500 dark:text-green-400">
          {line}
        </div>
      );
    });
  };
  
  // Format error with color coding
  const formatError = (text: string) => {
    return text.split("\n").map((line, index) => (
      <div key={index} className="text-red-500 dark:text-red-400">
        {line || <br />}
      </div>
    ));
  };
  
  return (
    <div className="h-full w-full bg-background overflow-hidden flex flex-col border-t border-border">
      <div className="flex items-center justify-between bg-muted px-4 py-2 border-b border-border">
        <div className="flex items-center">
          <span className="text-sm font-semibold">Console Output</span>
          {isExecuting && (
            <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              Running...
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClear} 
          disabled={!result}
          className="h-7 w-7"
          aria-label="Clear console"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        className="flex-1 p-4 font-mono text-sm overflow-auto bg-card dark:bg-zinc-900" 
        ref={outputRef}
        style={{ minHeight: "150px" }}
      >
        {result ? (
          <div>
            {result.output && formatOutput(result.output)}
            {result.error && formatError(result.error)}
          </div>
        ) : (
          <div className="text-muted-foreground italic p-2">
            Run your code to see output here
          </div>
        )}
      </div>
    </div>
  );
}
