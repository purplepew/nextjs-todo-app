'use server'
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToMongoDB() {
  try {
    // Check if we have an existing connection and if it's ready
    if (cached.conn) {
      // Verify the connection is still active
      if (mongoose.connection.readyState === 1) {
        return;
      }
      // Connection exists but is not ready, reset it
      cached.conn = null;
      cached.promise = null;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI!);
    }

    cached.conn = await cached.promise;
  } catch (error) {
    // Reset cache on error
    cached.conn = null;
    cached.promise = null;
    
    // Check if error indicates inactive/disconnected database
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes('timeout') ||
        errorMessage.includes('connection refused') ||
        errorMessage.includes('connection closed') ||
        errorMessage.includes('connection lost') ||
        errorMessage.includes('econnrefused') ||
        errorMessage.includes('topology') ||
        errorMessage.includes('server selection') ||
        errorMessage.includes('etimedout')
      ) {
        throw new Error('MongoDB Database is Inactive');
      }
    }
    throw error;
  }
}
