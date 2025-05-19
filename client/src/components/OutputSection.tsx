import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFontSize } from "@/hooks/use-font-size";

interface OutputSectionProps {
  output: string;
  onClear: () => void;
}

export function OutputSection({ output, onClear }: OutputSectionProps) {
  const { fontSize } = useFontSize();

  return (
    <div className="bg-white dark:bg-[var(--editor-dark)] border border-gray-300 dark:border-[var(--editor-dark-border)] rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-7 px-2"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>

      <pre
        className={`output-container p-4 font-mono font-size-${fontSize} bg-gray-50 dark:bg-gray-900 overflow-auto whitespace-pre`}
      >
        {output}
      </pre>
    </div>
  );
}
