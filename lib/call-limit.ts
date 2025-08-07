import { connectDB } from "@/lib/db";

interface LimitDoc {
    identifier: string;
    date: string;
    count: number;
}

interface CallLimitResponse {
    limitReached: boolean;
    remaining?: number;
    message?: string;
}

export async function checkAndUpdateCallLimit(update = false): Promise<CallLimitResponse> {
    const db = await connectDB();
    const collection = db.collection<LimitDoc>('freeCallLimits');

    const identifier = 'anonymous'; // Default to 'anonymous' for unauthenticated users
    const today = new Date().toISOString().split('T')[0];

    let limitDoc = await collection.findOne({ identifier, date: today });

    if (!limitDoc) {
        await collection.deleteMany({ identifier, date: { $lt: today } });
        limitDoc = { identifier, date: today, count: 0 };
        await collection.insertOne(limitDoc);
    }

    const remaining = 2 - limitDoc.count;
    if (remaining <= 0) {
        return { limitReached: true, message: 'Come back tomorrow' };
    }

    if (update) {
        await collection.updateOne(
            { identifier, date: today },
            { $inc: { count: 1 } },
            { upsert: true }
        );
        return { limitReached: false, remaining: remaining - 1 };
    }

    return { limitReached: false, remaining };
}

export async function setupTTLIndex() {
    const db = await connectDB();
    await db.collection<LimitDoc>('freeCallLimits').createIndex({ date: 1 }, { expireAfterSeconds: 86400 });
}

if (typeof window === 'undefined') {
    setupTTLIndex().catch(console.error);
}