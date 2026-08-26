import { createHash } from 'crypto';
import connectToDatabase from '@/lib/db/mongoose';

const CHAT_CACHE_TTL_SECONDS = getPositiveInteger(process.env.CHAT_CACHE_TTL_SECONDS, 60 * 60 * 12);
const MAX_REQUESTS_PER_MINUTE = getPositiveInteger(process.env.CHAT_RATE_LIMIT_PER_MINUTE, 10);
const MAX_REQUESTS_PER_DAY = getPositiveInteger(process.env.CHAT_RATE_LIMIT_PER_DAY, 40);

let indexesReady: Promise<void> | null = null;

interface ChatAnswerCacheEntry {
    answer: string;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds?: number;
}

function getPositiveInteger(value: string | undefined, fallback: number) {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function getDatabase() {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not established');

    if (!indexesReady) {
        indexesReady = Promise.all([
            db.collection('chatAnswerCache').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
            db.collection('chatRateLimits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
            db.collection('chatRateLimits').createIndex(
                { identifier: 1, window: 1, windowStart: 1 },
                { unique: true }
            ),
        ]).then(() => undefined);
    }
    await indexesReady;

    return db;
}

function hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
}

function cacheKey(model: string, knowledgeVersion: number, message: string) {
    return hash(`answer:v1:${model}:${knowledgeVersion}:${normalizeMessage(message)}`);
}

export function normalizeMessage(message: string) {
    return message.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isCacheEligible(message: string, hasPreviousUserMessage: boolean) {
    // Do not persist answers that may be tailored to a private, sensitive first message.
    return !hasPreviousUserMessage
        && message.length <= 500
        && !/[\w.+-]+@[\w-]+\.[\w.-]+/.test(message)
        && !/\b\d{13,19}\b/.test(message);
}

async function getKnowledgeVersion() {
    const db = await getDatabase();
    const result = await db.collection('chatCacheMeta').findOneAndUpdate(
        { _id: 'knowledge-version' },
        { $setOnInsert: { version: 1 } },
        { upsert: true, returnDocument: 'after' }
    );
    return (result as { version?: number } | null)?.version ?? 1;
}

export async function getCachedChatAnswer(model: string, message: string) {
    const db = await getDatabase();
    const version = await getKnowledgeVersion();
    const entry = await db.collection('chatAnswerCache').findOne({
        _id: cacheKey(model, version, message),
        expiresAt: { $gt: new Date() },
    });
    return (entry as ChatAnswerCacheEntry | null)?.answer;
}

export async function cacheChatAnswer(model: string, message: string, answer: string) {
    if (!answer.trim()) return;

    const db = await getDatabase();
    const version = await getKnowledgeVersion();
    await db.collection('chatAnswerCache').updateOne(
        { _id: cacheKey(model, version, message) },
        {
            $set: {
                answer,
                expiresAt: new Date(Date.now() + CHAT_CACHE_TTL_SECONDS * 1000),
                createdAt: new Date(),
                knowledgeVersion: version,
            },
        },
        { upsert: true }
    );
}

export async function bumpChatKnowledgeVersion() {
    const db = await getDatabase();
    await db.collection('chatCacheMeta').findOneAndUpdate(
        { _id: 'knowledge-version' },
        { $inc: { version: 1 }, $set: { updatedAt: new Date() } },
        { upsert: true }
    );
}

async function incrementRateLimit(identifier: string, window: 'minute' | 'day', maxRequests: number) {
    const now = new Date();
    const windowMilliseconds = window === 'minute' ? 60_000 : 86_400_000;
    const windowStart = new Date(Math.floor(now.getTime() / windowMilliseconds) * windowMilliseconds);
    const expiresAt = new Date(windowStart.getTime() + windowMilliseconds);
    const db = await getDatabase();
    const result = await db.collection('chatRateLimits').findOneAndUpdate(
        { identifier, window, windowStart },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
        { upsert: true, returnDocument: 'after' }
    );
    const count = (result as { count?: number } | null)?.count ?? 1;
    return { allowed: count <= maxRequests, remaining: Math.max(0, maxRequests - count), expiresAt };
}

export async function checkChatRateLimit(identifier: string): Promise<RateLimitResult> {
    const minute = await incrementRateLimit(identifier, 'minute', MAX_REQUESTS_PER_MINUTE);
    if (!minute.allowed) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((minute.expiresAt.getTime() - Date.now()) / 1000)),
        };
    }

    const day = await incrementRateLimit(identifier, 'day', MAX_REQUESTS_PER_DAY);
    if (!day.allowed) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((day.expiresAt.getTime() - Date.now()) / 1000)),
        };
    }

    return { allowed: true, remaining: Math.min(minute.remaining, day.remaining) };
}
