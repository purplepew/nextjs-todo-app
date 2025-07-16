'use server'
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToMongoDB() {
  if (cached.conn) return;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!);
  }

  cached.conn = await cached.promise;
}
