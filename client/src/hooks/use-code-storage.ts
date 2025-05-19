import { useState, useEffect } from "react";
import { Language } from "@/lib/codeExamples";

interface SavedFile {
  id: string;
  name: string;
  language: Language;
  code: string;
  createdAt: number;
}

export function useCodeStorage() {
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);

  useEffect(() => {
    // Load saved files from localStorage on initial mount
    const loadSavedFiles = () => {
      const savedFilesJson = localStorage.getItem("codeLearn-files");
      if (savedFilesJson) {
        try {
          const files = JSON.parse(savedFilesJson);
          setSavedFiles(files);
        } catch (error) {
          console.error("Failed to parse saved files:", error);
        }
      }
    };

    loadSavedFiles();
  }, []);

  const saveFile = (name: string, language: Language, code: string) => {
    const newFile: SavedFile = {
      id: Date.now().toString(),
      name,
      language,
      code,
      createdAt: Date.now(),
    };

    const updatedFiles = [...savedFiles, newFile];
    setSavedFiles(updatedFiles);
    localStorage.setItem("codeLearn-files", JSON.stringify(updatedFiles));
    return newFile;
  };

  const deleteFile = (id: string) => {
    const updatedFiles = savedFiles.filter(file => file.id !== id);
    setSavedFiles(updatedFiles);
    localStorage.setItem("codeLearn-files", JSON.stringify(updatedFiles));
  };

  const getFileById = (id: string) => {
    return savedFiles.find(file => file.id === id);
  };

  return {
    savedFiles,
    saveFile,
    deleteFile,
    getFileById,
  };
}
