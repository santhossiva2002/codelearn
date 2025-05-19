import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputPanel } from "@/components/OutputPanel";
import { HelpModal } from "@/components/HelpModal";
import { NewUserTooltip } from "@/components/NewUserTooltip";
import { CodeFile, Language, FontSize } from "@/types";
import { examples } from "@/lib/codeExamples";
import { getFileById, getSharedFile, saveFile } from "@/lib/fileStorage";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { useToast } from "@/hooks/use-toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function Editor() {
  // State
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [currentFile, setCurrentFile] = useState<CodeFile | null>(null);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [openFilesDialogOpen, setOpenFilesDialogOpen] = useState(false);
  
  // Code execution hook
  const { executeCode, clearOutput, isExecuting, result } = useCodeExecution();
  
  // Initialize with default example or shared code
  useEffect(() => {
    const sharedFile = getSharedFile();
    
    if (sharedFile) {
      setCurrentFile(sharedFile);
      setCode(sharedFile.content);
      setLanguage(sharedFile.language);
    } else {
      // Default to first JavaScript example
      const defaultExample = examples.find(e => e.language === "javascript");
      if (defaultExample) {
        setCurrentFile(defaultExample);
        setCode(defaultExample.content);
      }
    }
    
    // Check for saved font size preference
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize && (savedFontSize === "small" || savedFontSize === "medium" || savedFontSize === "large")) {
      setFontSize(savedFontSize as FontSize);
    }
  }, []);
  
  // Handle font size change
  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
  };
  
  // Handle language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    
    // If current file is an example, try to find an example in the new language
    if (currentFile?.isExample) {
      const exampleInNewLanguage = examples.find(e => e.language === newLanguage);
      if (exampleInNewLanguage) {
        setCurrentFile(exampleInNewLanguage);
        setCode(exampleInNewLanguage.content);
      }
    }
  };
  
  // Handle file selection
  const handleFileSelect = (file: CodeFile) => {
    setCurrentFile(file);
    setCode(file.content);
    setLanguage(file.language);
  };
  
  // Run code
  const handleRunCode = useCallback(() => {
    if (code.trim()) {
      executeCode(code, language);
    }
  }, [code, language, executeCode]);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  // Handle creating a new file
  const handleCreateNewFile = () => {
    // Default templates based on language
    const getDefaultTemplate = (language: Language) => {
      switch(language) {
        case 'javascript':
          return '// New JavaScript file\n\nconsole.log("Hello, world!");';
        case 'python':
          return '# New Python file\n\nprint("Hello, world!")';
        case 'java':
          return '// New Java file\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}';
        default:
          return '// New file';
      }
    };
    
    // Show dialog to ask for file name
    const fileName = prompt(
      "Enter a name for your new file:", 
      `Untitled.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'java'}`
    );
    
    if (!fileName) return; // User cancelled
    
    // Create a new file with the current language
    const newFile = saveFile({
      name: fileName,
      content: getDefaultTemplate(language),
      language: language
    });
    
    // Set the new file as the current file
    setCurrentFile(newFile);
    setCode(newFile.content);
    
    // Force refresh the sidebar by updating the timestamp
    forceUpdate();
  };
  
  // Force a rerender
  const [, setForceRender] = useState(0);
  const forceUpdate = () => setForceRender(prev => prev + 1);
  
  return (
    <div className="flex flex-col h-screen">
      <Navbar
        selectedLanguage={language}
        onLanguageChange={handleLanguageChange}
        currentFile={currentFile}
        onFileChange={setCurrentFile}
        onOpenFileClick={() => setOpenFilesDialogOpen(true)}
        code={code}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        onToggleSidebar={toggleSidebar}
        onHelpClick={() => setHelpModalOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSelectFile={handleFileSelect}
          selectedFileId={currentFile?.id || null}
          visible={sidebarVisible}
          onCreateNewFile={handleCreateNewFile}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75} minSize={30}>
              <CodeEditor
                code={code}
                language={language}
                onChange={setCode}
                onRun={handleRunCode}
                fontSize={fontSize}
                fileName={currentFile?.name || "Untitled"}
                onToggleSidebar={toggleSidebar}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={15}>
              <OutputPanel
                result={result}
                onClear={clearOutput}
                isExecuting={isExecuting}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      
      <HelpModal
        open={helpModalOpen}
        onOpenChange={setHelpModalOpen}
      />
      
      <NewUserTooltip />
    </div>
  );
}
