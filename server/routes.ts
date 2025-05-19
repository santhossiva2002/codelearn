import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { executeJavaScript } from "./executors/javascriptExecutor";
import { executePython } from "./executors/pythonExecutor";
import { executeJava } from "./executors/javaExecutor";
import { memoryStorage } from "./memoryStorage";
import { Language } from "@/types";

export async function registerRoutes(app: Express): Promise<Server> {
  // Code execution endpoint
  app.post("/api/execute", async (req, res) => {
    try {
      const { code, language } = req.body;
      
      if (!code) {
        return res.status(400).json({ 
          output: "",
          error: "No code provided",
          isError: true
        });
      }
      
      if (!language || !["javascript", "python", "java"].includes(language)) {
        return res.status(400).json({ 
          output: "",
          error: "Invalid or unsupported language",
          isError: true 
        });
      }
      
      let result;
      
      switch (language) {
        case "javascript":
          result = await executeJavaScript(code);
          break;
        case "python":
          result = await executePython(code);
          break;
        case "java":
          result = await executeJava(code);
          break;
        default:
          return res.status(400).json({ 
            output: "",
            error: "Unsupported language",
            isError: true 
          });
      }
      
      return res.json(result);
    } catch (error) {
      console.error("Execution error:", error);
      return res.status(500).json({ 
        output: "",
        error: error instanceof Error ? error.message : "An error occurred during execution",
        isError: true
      });
    }
  });

  // Initialize memory storage
  memoryStorage.initialize();

  // Get all files
  app.get("/api/files", async (req, res) => {
    try {
      const files = memoryStorage.getAllFiles();
      return res.json(files);
    } catch (error) {
      console.error("Error getting files:", error);
      return res.status(500).json({ 
        message: "Failed to retrieve files",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get file by ID
  app.get("/api/files/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const file = memoryStorage.getFileById(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      return res.json(file);
    } catch (error) {
      console.error(`Error getting file with ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        message: "Failed to retrieve file",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Create new file
  app.post("/api/files", async (req, res) => {
    try {
      const { name, content, language } = req.body;
      
      if (!name || !content || !language) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const newFile = memoryStorage.saveFile({
        name,
        content,
        language: language as Language
      });
      
      return res.status(201).json(newFile);
    } catch (error) {
      console.error("Error creating file:", error);
      return res.status(500).json({ 
        message: "Failed to create file",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Update existing file
  app.put("/api/files/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, content, language } = req.body;
      
      if (!name && !content && !language) {
        return res.status(400).json({ message: "No fields to update" });
      }
      
      const updatedFile = memoryStorage.updateFile(id, {
        name,
        content,
        language: language as Language
      });
      
      if (!updatedFile) {
        return res.status(404).json({ message: "File not found" });
      }
      
      return res.json(updatedFile);
    } catch (error) {
      console.error(`Error updating file with ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        message: "Failed to update file",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Delete file
  app.delete("/api/files/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = memoryStorage.deleteFile(id);
      
      if (!success) {
        return res.status(404).json({ message: "File not found" });
      }
      
      return res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error(`Error deleting file with ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        message: "Failed to delete file",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get files by language
  app.get("/api/files/language/:language", async (req, res) => {
    try {
      const { language } = req.params;
      
      if (!["javascript", "python", "java"].includes(language)) {
        return res.status(400).json({ message: "Invalid language" });
      }
      
      const files = memoryStorage.getFilesByLanguage(language as Language);
      return res.json(files);
    } catch (error) {
      console.error(`Error getting files with language ${req.params.language}:`, error);
      return res.status(500).json({ 
        message: "Failed to retrieve files",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // File upload endpoint (for loading local files)
  app.post("/api/upload", async (req, res) => {
    try {
      const { name, content, language } = req.body;
      
      if (!name || !content || !language) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Determine language from file extension if not provided
      let detectedLanguage = language;
      if (!detectedLanguage) {
        const ext = name.split('.').pop()?.toLowerCase();
        if (ext === 'js') detectedLanguage = 'javascript' as Language;
        else if (ext === 'py') detectedLanguage = 'python' as Language;
        else if (ext === 'java') detectedLanguage = 'java' as Language;
        else detectedLanguage = 'javascript' as Language; // Default
      }
      
      const newFile = memoryStorage.saveFile({
        name,
        content,
        language: detectedLanguage as Language
      });
      
      return res.status(201).json(newFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ 
        message: "Failed to upload file",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // File download endpoint
  app.get("/api/download/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const file = memoryStorage.getFileById(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(file.name)}`);
      
      return res.send(file.content);
    } catch (error) {
      console.error(`Error downloading file with ID ${req.params.id}:`, error);
      return res.status(500).json({ 
        message: "Failed to download file",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
