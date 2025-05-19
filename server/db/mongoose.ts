import mongoose from 'mongoose';

// MongoDB connection string
// For production, this should be stored in environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codelearn';

// Set mongoose options
mongoose.set('strictQuery', true);

// Variable to track connection status
let isConnected = false;

// Connect to MongoDB with a timeout
export async function connectToDatabase() {
  // If already connected, return true
  if (isConnected) {
    return true;
  }
  
  try {
    // Set a connection timeout to avoid hanging
    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // 3 seconds timeout
      connectTimeoutMS: 3000,
      socketTimeoutMS: 3000
    });
    
    isConnected = true;
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('Proceeding without database connection');
    isConnected = false;
    return false;
  }
}

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    return true;
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error);
    return false;
  }
}

// Get the connection instance
export function getConnection() {
  return mongoose.connection;
}

// MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle app termination - close the connection
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});