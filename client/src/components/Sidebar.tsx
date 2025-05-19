import { useState, useEffect } from "react";
import { CodeFile, Language } from "@/types";
import { examples } from "@/lib/codeExamples";
import { getAllFiles } from "@/lib/fileStorage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

interface SidebarProps {
  onSelectFile: (file: CodeFile) => void;
  selectedFileId: string | null;
  visible: boolean;
  onCreateNewFile?: () => void;
}

export function Sidebar({ onSelectFile, selectedFileId, visible, onCreateNewFile }: SidebarProps) {
  const [userFiles, setUserFiles] = useState<CodeFile[]>(getAllFiles());
  
  // Refresh file list whenever sidebar is displayed
  useEffect(() => {
    if (visible) {
      setUserFiles(getAllFiles());
    }
  }, [visible, selectedFileId]);
  
  const handleSelectFile = (file: CodeFile) => {
    onSelectFile(file);
  };
  
  const getFileIcon = (language: Language) => {
    switch (language) {
      case "javascript":
        return "ri-javascript-line text-yellow-500";
      case "python":
        return "ri-python-line text-blue-500";
      case "java":
        return "ri-java-line text-red-500";
      default:
        return "ri-file-code-line text-gray-500";
    }
  };
  
  const resourceLinks = [
    { name: "JavaScript Basics", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    { name: "Python for Beginners", url: "https://docs.python.org/3/tutorial/" },
    { name: "Java Tutorial", url: "https://docs.oracle.com/javase/tutorial/" }
  ];
  
  if (!visible) return null;
  
  return (
    <div className="w-64 border-r border-border bg-card flex-shrink-0 md:block">
      <ScrollArea className="h-full">
        <div className="flex flex-col h-full">
          {/* Example files section */}
          <div className="p-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Example Files
            </h2>
            <div className="mt-3 space-y-1">
              {examples.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    selectedFileId === file.id
                      ? "bg-secondary text-secondary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => handleSelectFile(file)}
                >
                  <i className={`${getFileIcon(file.language)} mr-2`}></i>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* My Projects */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                My Projects
              </h2>
              <button 
                className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90" 
                onClick={onCreateNewFile}
                aria-label="Create new file"
                title="Create new file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <div className="mt-3 space-y-1">
              {userFiles.length > 0 ? (
                userFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      selectedFileId === file.id
                        ? "bg-secondary text-secondary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => handleSelectFile(file)}
                  >
                    <i className={`${getFileIcon(file.language)} mr-2`}></i>
                    <span className="truncate">{file.name}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground px-3 py-2">
                  No saved projects yet
                </div>
              )}
            </div>
          </div>
          
          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Helpful resources */}
          <div className="p-4 border-t border-border">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Learning Resources
            </h2>
            <div className="mt-3 space-y-1">
              {resourceLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 text-sm font-medium text-primary rounded-md hover:bg-muted"
                >
                  <i className="ri-book-open-line mr-2"></i>
                  <span>{link.name}</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
