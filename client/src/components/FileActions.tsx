import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CodeFile } from "@/types";
import { saveFile, updateFile } from "@/lib/fileStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save, FolderOpen, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileActionsProps {
  currentFile: CodeFile | null;
  onFileChange: (file: CodeFile) => void;
  onOpenFileClick: () => void;
  code: string;
}

export function FileActions({ currentFile, onFileChange, onOpenFileClick, code }: FileActionsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();
  
  // References for file input and download link
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // Handle save to local memory
  const handleSaveClick = () => {
    if (currentFile && !currentFile.isExample) {
      // Update existing file in app memory
      const updated = updateFile({
        ...currentFile,
        content: code
      });
      onFileChange(updated);
      toast({
        title: "File saved",
        description: `${updated.name} has been saved in the app.`
      });
    } else {
      // Show save dialog for new file or when trying to save an example
      setFileName(currentFile?.name || "Untitled.js");
      setSaveDialogOpen(true);
    }
  };

  // Handle saving to local memory
  const handleSaveConfirm = () => {
    if (!fileName.trim()) {
      toast({
        title: "Invalid filename",
        description: "Please enter a valid filename",
        variant: "destructive"
      });
      return;
    }

    const newFile = saveFile({
      name: fileName,
      content: code,
      language: currentFile?.language || "javascript"
    });
    
    onFileChange(newFile);
    setSaveDialogOpen(false);
    
    toast({
      title: "File saved",
      description: `${newFile.name} has been saved in the app.`
    });
  };
  
  // Download file to local system
  const handleDownloadFile = () => {
    if (!currentFile) return;
    
    // Create a temporary download link
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Set up download link
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = currentFile.name;
      downloadLinkRef.current.click();
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    
    toast({
      title: "File downloaded",
      description: `${currentFile.name} has been downloaded to your device.`
    });
  };
  
  // Trigger file input click for opening local files
  const handleOpenLocalFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Process the selected file
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Determine language from file extension
    let detectedLanguage: "javascript" | "python" | "java" = "javascript";
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (ext === 'py') {
      detectedLanguage = "python";
    } else if (ext === 'java') {
      detectedLanguage = "java";
    }
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      
      // Create a new file in the app
      const newFile = saveFile({
        name: file.name,
        content: fileContent,
        language: detectedLanguage
      });
      
      onFileChange(newFile);
      
      toast({
        title: "File opened",
        description: `${file.name} has been loaded into the editor.`
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Hidden file input for opening local files */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelected} 
        accept=".js,.py,.java,.txt" 
        style={{ display: 'none' }} 
      />
      
      {/* Hidden download link */}
      <a 
        ref={downloadLinkRef} 
        style={{ display: 'none' }} 
      />
      
      <Button
        variant="outline"
        size="sm"
        className="inline-flex items-center"
        onClick={handleOpenLocalFile}
      >
        <FolderOpen className="h-4 w-4 mr-1" />
        Open
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="inline-flex items-center"
        onClick={handleSaveClick}
      >
        <Save className="h-4 w-4 mr-1" />
        Save
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="inline-flex items-center"
        onClick={handleDownloadFile}
        disabled={!currentFile}
      >
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save File</DialogTitle>
            <DialogDescription>
              Enter a name for your file
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Filename
              </Label>
              <Input
                id="name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfirm}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
