import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

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

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'projects';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        if (!process.env.ACESS_KEY_ID || !process.env.SECRET_ACCESS_KEY) {
            return NextResponse.json(
                { error: 'Storage credentials not configured' },
                { status: 500 }
            );
        }

        const fileExt = file.name.split('.').pop();
        const uniqueFilename = `${uuidv4()}.${fileExt}`;
        const filePath = `${folder}/${uniqueFilename}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filePath,
            Body: buffer,
            ContentType: file.type || 'application/octet-stream',
            ACL: 'public-read',
        });

        await s3Client.send(command);

        const publicUrl = `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${filePath}`;

        return NextResponse.json({
            url: publicUrl,
            path: filePath,
            filename: file.name,
            content_type: file.type,
            size: file.size,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upload file' },
            { status: 500 }
        );
    }
}
