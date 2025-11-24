import { NextResponse } from 'next/server';
import { checkAndUpdateCallLimit } from '@/lib/call-limit';

export async function GET() {
    try {
        const result = await checkAndUpdateCallLimit(); // Use a user identifier if available
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error checking call limit:', error);
        return NextResponse.json({ limitReached: true, message: 'Error checking availability' }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const { action } = await request.json();
        if (action !== 'update') {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
        const result = await checkAndUpdateCallLimit(true); // Update the count
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating call limit:', error);
        return NextResponse.json({ limitReached: true, message: 'Error updating availability' }, { status: 500 });
    }
}