import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    endpoint: process.env.SUPABASE_S3_ENDPOINT_URL || 'https://mtvmbtnyybwqikvrwqge.storage.supabase.co/storage/v1/s3',
    region: process.env.SUPABASE_S3_REGION_NAME || 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACESS_KEY_ID || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
});

const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'portfolio';
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'mtvmbtnyybwqikvrwqge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder') || '';
        const limit = parseInt(searchParams.get('limit') || '100');

        if (!process.env.ACESS_KEY_ID || !process.env.SECRET_ACCESS_KEY) {
            return NextResponse.json(
                { error: 'Storage credentials not configured' },
                { status: 500 }
            );
        }

        const prefix = folder ? `${folder}/` : '';

        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
            MaxKeys: limit,
        });

        const response = await s3Client.send(command);

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
        
        const files = (response.Contents || [])
            .filter(obj => {
                const ext = obj.Key?.split('.').pop()?.toLowerCase();
                return ext && imageExtensions.includes(ext);
            })
            .map(obj => {
                const fileName = obj.Key?.split('/').pop() || '';
                return {
                    name: fileName,
                    url: `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${obj.Key}`,
                    path: obj.Key,
                    size: obj.Size,
                    lastModified: obj.LastModified?.toISOString(),
                };
            });

        return NextResponse.json({ files });
    } catch (error) {
        console.error('List error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to list files' },
            { status: 500 }
        );
    }
}
