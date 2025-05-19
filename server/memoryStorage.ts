import { Language } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { examples } from "../client/src/lib/codeExamples";

// Interface for a code file
export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: Language;
  timestamp: number;
  isExample?: boolean;
}

// In-memory storage class for code files
class MemoryStorage {
  private files: Map<string, CodeFile>;
  private exampleFiles: Map<string, CodeFile>;
  private initialized: boolean;

  constructor() {
    this.files = new Map();
    this.exampleFiles = new Map();
    this.initialized = false;
  }

  // Initialize with example files
  public initialize(): void {
    if (this.initialized) return;
    
    // Add example files to storage
    examples.forEach(example => {
      const exampleFile: CodeFile = {
        id: example.id,
        name: example.name,
        content: example.content,
        language: example.language,
        timestamp: Date.now(),
        isExample: true
      };
      this.exampleFiles.set(example.id, exampleFile);
    });

    this.initialized = true;
    console.log('Memory storage initialized with example files');
  }

  // Get all files
  public getAllFiles(): CodeFile[] {
    // Combine user files and example files
    return Array.from(this.files.values()).concat(Array.from(this.exampleFiles.values()));
  }

  // Get user files only (non-examples)
  public getUserFiles(): CodeFile[] {
    return Array.from(this.files.values());
  }

  // Get file by ID
  public getFileById(id: string): CodeFile | undefined {
    // Check user files first
    if (this.files.has(id)) {
      return this.files.get(id);
    }
    
    // Then check example files
    return this.exampleFiles.get(id);
  }

  // Save a new file
  public saveFile(fileData: Omit<CodeFile, "id" | "timestamp">): CodeFile {
    const id = uuidv4();
    const newFile: CodeFile = {
      id,
      ...fileData,
      timestamp: Date.now()
    };
    
    this.files.set(id, newFile);
    return newFile;
  }

  // Update an existing file
  public updateFile(id: string, fileData: Partial<Omit<CodeFile, "id" | "timestamp" | "isExample">>): CodeFile | undefined {
    // Examples cannot be updated
    if (this.exampleFiles.has(id)) {
      throw new Error("Example files cannot be modified");
    }
    
    // Check if file exists
    const existingFile = this.files.get(id);
    if (!existingFile) {
      return undefined;
    }
    
    // Update file
    const updatedFile: CodeFile = {
      ...existingFile,
      ...fileData,
      timestamp: Date.now()
    };
    
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  // Delete a file
  public deleteFile(id: string): boolean {
    // Examples cannot be deleted
    if (this.exampleFiles.has(id)) {
      throw new Error("Example files cannot be deleted");
    }
    
    return this.files.delete(id);
  }

  // Get files by language
  public getFilesByLanguage(language: Language): CodeFile[] {
    const userFiles = Array.from(this.files.values()).filter(file => file.language === language);
    const exampleFilesOfLanguage = Array.from(this.exampleFiles.values()).filter(file => file.language === language);
    
    return userFiles.concat(exampleFilesOfLanguage);
  }

  // Get examples by language
  public getExamplesByLanguage(language: Language): CodeFile[] {
    return Array.from(this.exampleFiles.values()).filter(file => file.language === language);
  }
}

// Export singleton instance
export const memoryStorage = new MemoryStorage();