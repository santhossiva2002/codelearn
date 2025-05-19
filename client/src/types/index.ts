export type Language = "javascript" | "python" | "java";

export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: Language;
  timestamp: number;
  isExample?: boolean;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  isError: boolean;
  executionTime?: number;  // Add this line
}

export type FontSize = "small" | "medium" | "large";

export interface ExampleFile extends CodeFile {
  isExample: true;
}
