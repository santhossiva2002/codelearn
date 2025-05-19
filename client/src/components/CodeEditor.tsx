import { useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, Menu } from "lucide-react";
import { Language, FontSize } from "@/types";

interface CodeEditorProps {
  code: string;
  language: Language;
  onChange: (value: string) => void;
  onRun: () => void;
  fontSize: FontSize;
  fileName: string;
  onToggleSidebar: () => void;
}

const mapLanguage = (language: Language): string => {
  switch (language) {
    case "javascript":
      return "javascript";
    case "python":
      return "python";
    case "java":
      return "java";
    default:
      return "javascript";
  }
};

const mapFontSize = (size: FontSize): number => {
  switch (size) {
    case "small":
      return 14;
    case "medium":
      return 16;
    case "large":
      return 18;
    default:
      return 16;
  }
};

export function CodeEditor({
  code,
  language,
  onChange,
  onRun,
  fontSize,
  fileName,
  onToggleSidebar
}: CodeEditorProps) {
  // Add keyboard shortcuts for code execution
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Enter or Cmd+Enter
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        onRun();
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onRun]);

  // Get current theme from document
  const isDarkTheme = typeof document !== 'undefined' 
    ? document.documentElement.classList.contains('dark') 
    : false;
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Editor controls */}
      <div className="flex items-center justify-between bg-muted px-4 py-2 border-b border-border">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-8 w-8" 
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium truncate max-w-[200px]" title={fileName}>
            {fileName}
          </span>
        </div>
        
        {/* Run button */}
        <Button 
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white" 
          size="sm"
          onClick={onRun}
        >
          <Play className="h-4 w-4 mr-1" />
          Run
        </Button>
      </div>
      
      {/* Monaco editor using React wrapper */}
      <div className="flex-1 h-full">
        <MonacoEditor
          value={code}
          language={mapLanguage(language)}
          theme={isDarkTheme ? "vs-dark" : "vs-light"}
          options={{
            fontSize: mapFontSize(fontSize),
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 10 },
            fontFamily: '"Fira Code", monospace, "Courier New", monospace',
            automaticLayout: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
            },
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            renderLineHighlight: 'all',
            suggestOnTriggerCharacters: true
          }}
          onChange={(value) => onChange(value || "")}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
