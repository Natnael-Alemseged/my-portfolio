import mongoose from 'mongoose';

const MONGODB_URI = (process.env.MONGODB_URI || '').trim();

if (!MONGODB_URI || MONGODB_URI === 'your-fallback-uri') {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        console.log('Connecting to MongoDB...');
        cached.promise = mongoose.connect(MONGODB_URI, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
            maxPoolSize: 5,
        }).then((mongoose) => {
            console.log('✅ Connected to MongoDB');
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;
