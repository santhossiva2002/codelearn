import { CodeFile, Language } from "@/types";
import { examples } from "./codeExamples";

const STORAGE_KEY = "codelearn_files";

export const saveFile = (file: Omit<CodeFile, "id" | "timestamp">): CodeFile => {
  const files = getAllFiles();
  
  const newFile: CodeFile = {
    ...file,
    id: generateId(),
    timestamp: Date.now()
  };
  
  files.push(newFile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  
  return newFile;
};

export const updateFile = (file: CodeFile): CodeFile => {
  const files = getAllFiles();
  const index = files.findIndex(f => f.id === file.id);
  
  if (index !== -1) {
    files[index] = {
      ...file,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    return files[index];
  }
  
  throw new Error("File not found");
};

export const getAllFiles = (): CodeFile[] => {
  const filesJson = localStorage.getItem(STORAGE_KEY);
  if (!filesJson) return [];
  try {
    return JSON.parse(filesJson);
  } catch {
    return [];
  }
};

export const getFileById = (id: string): CodeFile | undefined => {
  // Check user files first
  const files = getAllFiles();
  const file = files.find(f => f.id === id);
  if (file) return file;
  
  // Check examples
  return examples.find(e => e.id === id);
};

export const deleteFile = (id: string): boolean => {
  const files = getAllFiles();
  const newFiles = files.filter(f => f.id !== id);
  
  if (newFiles.length !== files.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
    return true;
  }
  
  return false;
};

export const shareFile = (file: CodeFile): string => {
  const params = new URLSearchParams();
  params.set("code", encodeURIComponent(file.content));
  params.set("lang", file.language);
  params.set("name", file.name);
  
  return `${window.location.origin}/?${params.toString()}`;
};

export const getSharedFile = (): CodeFile | null => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const lang = params.get("lang") as Language;
  const name = params.get("name");
  
  if (code && lang && name) {
    return {
      id: "shared",
      name: name,
      content: decodeURIComponent(code),
      language: lang,
      timestamp: Date.now()
    };
  }
  
  return null;
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
