import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileIcon, FolderOpenIcon, Save, ChevronDown, Code } from "lucide-react";
import { Language, getExamplesByLanguage } from "@/lib/codeExamples";

interface FileOperationsProps {
  onNewFile: () => void;
  onSaveFile: () => void;
  onLoadFile: () => void;
  onLoadExample: (exampleId: string) => void;
  currentLanguage: Language;
}

export function FileOperations({
  onNewFile,
  onSaveFile,
  onLoadFile,
  onLoadExample,
  currentLanguage,
}: FileOperationsProps) {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [examplesMenuOpen, setExamplesMenuOpen] = useState(false);
  
  const examples = getExamplesByLanguage(currentLanguage);

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu open={fileMenuOpen} onOpenChange={setFileMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <FileIcon className="h-4 w-4 mr-1" />
            File
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => { onNewFile(); setFileMenuOpen(false); }}>
            <FileIcon className="h-4 w-4 mr-2" />
            New
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { onSaveFile(); setFileMenuOpen(false); }}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { onLoadFile(); setFileMenuOpen(false); }}>
            <FolderOpenIcon className="h-4 w-4 mr-2" />
            Load
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu open={examplesMenuOpen} onOpenChange={setExamplesMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Code className="h-4 w-4 mr-1" />
            Examples
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            {currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}
          </div>
          {examples.map((example) => (
            <DropdownMenuItem
              key={example.id}
              onClick={() => {
                onLoadExample(example.id);
                setExamplesMenuOpen(false);
              }}
            >
              {example.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
