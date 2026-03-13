import mongoose from 'mongoose';

declare global {
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in your .env.local file');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Get auth settings from environment variables
    const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin';
    
    // Check if using MongoDB Atlas (mongodb+srv://) or standard MongoDB
    const isAtlas = MONGODB_URI.startsWith('mongodb+srv://');
    
    // Build connection options
const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    };
    
    if (!isAtlas) {
      // For standard MongoDB connections, add auth options
      if (!MONGODB_URI.includes('authSource=')) {
        opts.authSource = authSource;
      }
    }

    // For Atlas: try SRV first, then fallback to direct connection
    if (isAtlas) {
      // First attempt: Try with Atlas default settings (no extra options)
      try {
console.log('Connection attempt 1 - Atlas SRV to:', MONGODB_URI ? MONGODB_URI.split('@')[0] + '@[hidden]' : 'no URI');
cached.promise = mongoose.connect(MONGODB_URI, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 10000,
        });
cached.conn = await cached.promise;
        console.log('MongoDB Atlas connected successfully');
        return cached.conn;
      } catch (srvError: any) {
        // If SRV fails, try with direct connection
        console.log('SRV connection failed, trying direct connection...');
        
        // Convert mongodb+srv:// to mongodb://
        const directUri = MONGODB_URI.replace('mongodb+srv://', 'mongodb://');
        
        // Extract cluster details from the URI for direct connection
        // Format: mongodb+srv://user:pass@cluster.mongodb.net/db?options
        // Convert to: mongodb://user:pass@cluster-shard-00-00.mongodb.net:27017,cluster-shard-00-01.mongodb.net:27017/db?options
        
console.log('Connection attempt 2 - Direct Atlas to:', directUri ? directUri.split('@')[0] + '@[hidden]' : 'no URI');
cached.promise = mongoose.connect(directUri, {
          bufferCommands: false,
          authSource: authSource,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 10000,
        });
      }
    } else {
console.log('Connection attempt 3 - Standard to:', MONGODB_URI ? MONGODB_URI.split('@')[0] + '@[hidden]' : 'no URI');
cached.promise = mongoose.connect(MONGODB_URI, opts);
    }
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    
    // Provide more helpful error messages
    if (error.message?.includes('ECONNREFUSED')) {
      console.error('MongoDB connection refused. Please check:');
      console.error('1. Your MongoDB Atlas cluster is running');
      console.error('2. Your IP is whitelisted in MongoDB Atlas Network Access');
      console.error('3. Your internet connection is working');
    } else if (error.message?.includes('authentication failed')) {
      console.error('MongoDB authentication failed. Please check:');
      console.error('1. Your username and password are correct');
      console.error('2. The database name in your connection string is correct');
      console.error('3. The user has access to the specified database');
    }
    
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
