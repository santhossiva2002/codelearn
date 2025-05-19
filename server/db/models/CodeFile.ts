import mongoose, { Schema, Document } from 'mongoose';
import { Language } from '@/types';

// Interface for a CodeFile document
export interface ICodeFile extends Document {
  name: string;
  content: string;
  language: Language;
  timestamp: number;
  isExample?: boolean;
  userId?: string; // Optional for future authentication
}

// Schema definition for CodeFile
const CodeFileSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  language: { 
    type: String, 
    required: true,
    enum: ['javascript', 'python', 'java']
  },
  timestamp: { 
    type: Number, 
    default: Date.now 
  },
  isExample: { 
    type: Boolean, 
    default: false 
  },
  userId: { 
    type: String
  }
});

// Create and export the model
export default mongoose.model<ICodeFile>('CodeFile', CodeFileSchema);