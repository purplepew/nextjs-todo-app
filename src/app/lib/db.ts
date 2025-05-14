'use server'
import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToMongoDB() {
  if (cached.conn) return;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!);
  }

  cached.conn = await cached.promise;
}
