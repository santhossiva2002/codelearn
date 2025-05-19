import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { FileOperations } from "./FileOperations";
import { Language } from "@/lib/codeExamples";

interface ActionBarProps {
  onRun: () => void;
  onNewFile: () => void;
  onSaveFile: () => void;
  onLoadFile: () => void;
  onLoadExample: (exampleId: string) => void;
  isRunning: boolean;
  currentLanguage: Language;
}

export function ActionBar({
  onRun,
  onNewFile,
  onSaveFile,
  onLoadFile,
  onLoadExample,
  isRunning,
  currentLanguage,
}: ActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
      <FileOperations
        onNewFile={onNewFile}
        onSaveFile={onSaveFile}
        onLoadFile={onLoadFile}
        onLoadExample={onLoadExample}
        currentLanguage={currentLanguage}
      />

      <Button
        onClick={onRun}
        disabled={isRunning}
        className="px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md relative h-10"
      >
        {isRunning ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            <Play className="h-5 w-5 mr-2" />
            Run Code
          </>
        )}
      </Button>
    </div>
  );
}
