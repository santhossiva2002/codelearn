import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedFile {
  id: string;
  name: string;
  language: string;
  createdAt: number;
}

interface LoadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  savedFiles: SavedFile[];
}

export function LoadFileModal({
  isOpen,
  onClose,
  onLoad,
  onDelete,
  savedFiles,
}: LoadFileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Load File</DialogTitle>
        </DialogHeader>

        {savedFiles.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
              />
            </svg>
            <p>No saved files found.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-60">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {savedFiles.map((file) => (
                <li key={file.id} className="py-3 flex justify-between items-center">
                  <button
                    onClick={() => onLoad(file.id)}
                    className="text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex-grow"
                  >
                    {file.name}{" "}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({file.language})
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(file.id)}
                    className="h-7 w-7 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
