import CodeFile, { ICodeFile } from '../models/CodeFile';
import { Language } from '@/types';

// In-memory storage fallback
const memoryStorage: Map<string, ICodeFile> = new Map();

// Get all files
export async function getAllFiles(): Promise<ICodeFile[]> {
  try {
    return await CodeFile.find({ isExample: false }).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error fetching all files:', error);
    throw error;
  }
}

// Get file by ID
export async function getFileById(id: string): Promise<ICodeFile | null> {
  try {
    return await CodeFile.findById(id);
  } catch (error) {
    console.error(`Error fetching file with ID ${id}:`, error);
    throw error;
  }
}

// Save a new file
export async function saveFile(fileData: { 
  name: string; 
  content: string; 
  language: Language;
  isExample?: boolean;
}): Promise<ICodeFile> {
  try {
    const newFile = new CodeFile({
      ...fileData,
      timestamp: Date.now()
    });
    return await newFile.save();
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}

// Update an existing file
export async function updateFile(id: string, fileData: {
  name?: string;
  content?: string;
  language?: Language;
}): Promise<ICodeFile | null> {
  try {
    return await CodeFile.findByIdAndUpdate(
      id,
      { ...fileData, timestamp: Date.now() },
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating file with ID ${id}:`, error);
    throw error;
  }
}

// Delete a file
export async function deleteFile(id: string): Promise<boolean> {
  try {
    const result = await CodeFile.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error(`Error deleting file with ID ${id}:`, error);
    throw error;
  }
}

// Get files by language
export async function getFilesByLanguage(language: Language): Promise<ICodeFile[]> {
  try {
    return await CodeFile.find({ language, isExample: false }).sort({ timestamp: -1 });
  } catch (error) {
    console.error(`Error fetching files with language ${language}:`, error);
    throw error;
  }
}

// Initialize example files
export async function initializeExampleFiles(examples: Array<{
  id: string;
  name: string;
  content: string;
  language: Language;
}>): Promise<void> {
  try {
    // Only insert examples if they don't exist already
    for (const example of examples) {
      const existingExample = await CodeFile.findOne({ name: example.name, isExample: true });
      if (!existingExample) {
        const newExample = new CodeFile({
          name: example.name,
          content: example.content,
          language: example.language,
          isExample: true,
          timestamp: Date.now()
        });
        await newExample.save();
      }
    }
    console.log('Example files initialized');
  } catch (error) {
    console.error('Error initializing example files:', error);
    throw error;
  }
}