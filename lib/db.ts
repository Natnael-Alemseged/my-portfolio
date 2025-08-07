import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_DB_URL!);

export async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('yourDatabaseName'); // Replace with your database name
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}