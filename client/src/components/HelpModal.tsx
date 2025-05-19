import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">CodeLearn Help</DialogTitle>
          <DialogDescription>
            Get started with our online code editor
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <h4 className="font-medium text-lg">Getting Started</h4>
            <p className="text-sm text-muted-foreground mt-1">
              CodeLearn is a simple online code editor designed for beginners. You can write, run, and save code without needing to create an account.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-lg">Supported Languages</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Currently, we support JavaScript, Python, and Java. Select your preferred language from the dropdown in the top navigation bar.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-lg">Running Your Code</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Click the "Run" button to execute your code. The output will appear in the console panel below the editor.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-lg">Saving Your Work</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Click the "Save" button to store your code locally on your device. Your saved projects will appear in the sidebar under "My Projects".
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-lg">Sharing Your Code</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Use the "Share" button to generate a URL that you can send to others to view your code.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-lg">Keyboard Shortcuts</h4>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between px-2 py-1 bg-muted rounded">
                <span className="text-muted-foreground">Run Code</span>
                <span className="font-mono">Ctrl+Enter</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-muted rounded">
                <span className="text-muted-foreground">Save</span>
                <span className="font-mono">Ctrl+S</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-muted rounded">
                <span className="text-muted-foreground">Format Code</span>
                <span className="font-mono">Shift+Alt+F</span>
              </div>
              <div className="flex justify-between px-2 py-1 bg-muted rounded">
                <span className="text-muted-foreground">Comment Line</span>
                <span className="font-mono">Ctrl+/</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
