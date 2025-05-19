import { Menu, HelpCircle, Share, Save, FolderOpen, Download } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { FileActions } from "./FileActions";
import { ThemeToggle } from "./ThemeToggle";
import { FontSizeSelector } from "./FontSizeSelector";
import { Button } from "@/components/ui/button";
import { CodeFile, FontSize, Language } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  currentFile: CodeFile | null;
  onFileChange: (file: CodeFile) => void;
  onOpenFileClick: () => void;
  code: string;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  onToggleSidebar: () => void;
  onHelpClick: () => void;
  onSaveClick?: () => void;
  onDownloadClick?: () => void;
}

export function Navbar({
  selectedLanguage,
  onLanguageChange,
  currentFile,
  onFileChange,
  onOpenFileClick,
  code,
  fontSize,
  onFontSizeChange,
  onToggleSidebar,
  onHelpClick,
  onSaveClick,
  onDownloadClick
}: NavbarProps) {
  
  // Function to handle file download if no handler is provided
  const handleDownload = () => {
    if (onDownloadClick) {
      onDownloadClick();
    } else {
      // Default download implementation
      const element = document.createElement("a");
      const file = new Blob([code], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${currentFile?.name || `code.${selectedLanguage === "javascript" ? "js" : selectedLanguage === "python" ? "py" : "java"}`}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // Function to handle file save if no handler is provided
  const handleSave = () => {
    if (onSaveClick) {
      onSaveClick();
    } else if (currentFile) {
      // If FileActions component has an onSave method, try to find and call it
      const saveButton = document.querySelector('[data-action="save"]');
      if (saveButton instanceof HTMLElement) {
        saveButton.click();
      }
    }
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <i className="ri-code-box-line text-primary text-2xl mr-2"></i>
                <span className="font-bold text-xl text-primary">CodeLearn</span>
              </div>
            </div>
            
            {/* Language selector - visible on desktop only */}
            <div className="ml-6 hidden md:flex items-center space-x-4">
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Desktop sidebar toggle - on medium screens */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex lg:hidden" 
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* File Actions - hidden on mobile */}
            <div className="hidden md:block">
              <FileActions 
                currentFile={currentFile}
                onFileChange={onFileChange}
                onOpenFileClick={onOpenFileClick}
                code={code}
              />
            </div>
            
            {/* Settings - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1">
              <FontSizeSelector 
                fontSize={fontSize} 
                onFontSizeChange={onFontSizeChange}
              />
              
              <ThemeToggle />
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={onHelpClick}
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Mobile menu button - visible on mobile only */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>CodeLearn</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <h3 className="mb-2 font-semibold">Language</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <Button
                        variant={selectedLanguage === "javascript" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onLanguageChange("javascript")}
                      >
                        JavaScript
                      </Button>
                      <Button
                        variant={selectedLanguage === "python" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onLanguageChange("python")}
                      >
                        Python
                      </Button>
                      <Button
                        variant={selectedLanguage === "java" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onLanguageChange("java")}
                      >
                        Java
                      </Button>
                    </div>
                    
                    <h3 className="mb-2 font-semibold">File Actions</h3>
                    <div className="grid gap-2 mb-6">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={handleSave}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => {
                          // Explicitly close the sheet first then open files
                          const closeButton = document.querySelector('[data-sheet-close]') as HTMLElement;
                          if (closeButton) closeButton.click();
                          
                          // Add a small delay to ensure sheet closes before dialog opens
                          setTimeout(() => {
                            onOpenFileClick();
                          }, 100);
                        }}
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={handleDownload}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    
                    <h3 className="mb-2 font-semibold">Settings</h3>
                    <div className="space-y-4">
                      {/* Theme toggle for mobile - using your existing ThemeToggle component */}
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-2">Theme</h4>
                        <div className="w-full">
                          <ThemeToggle isMobile={true} />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-2">Font Size</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={fontSize === "small" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onFontSizeChange("small")}
                          >
                            Small
                          </Button>
                          <Button
                            variant={fontSize === "medium" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onFontSizeChange("medium")}
                          >
                            Medium
                          </Button>
                          <Button
                            variant={fontSize === "large" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onFontSizeChange("large")}
                          >
                            Large
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-2">Help</h4>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            // Close the sheet first, then open help
                            const closeButton = document.querySelector('[data-sheet-close]') as HTMLElement;
                            if (closeButton) closeButton.click();
                            
                            // Add a small delay to ensure sheet closes before help opens
                            setTimeout(() => {
                              onHelpClick();
                            }, 100);
                          }}
                        >
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Help & Documentation
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}