import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchMemories } from '@/lib/qdrant-sync';

// Force dynamic evaluation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    try {
        return new NextResponse('Chat API endpoint is running', { status: 200 });
    } catch (error) {
        console.error('GET error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Allow': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        // Initialize OpenAI (Groq) inside the handler to avoid top-level issues
        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        if (!GROQ_API_KEY) {
            return NextResponse.json(
                { error: 'API key configuration missing' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1',
        });

        // Parse request body safely
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json(
                { error: 'Invalid JSON request body' },
                { status: 400 }
            );
        }

        const { message, conversationHistory = [] } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        let context = '';
        try {
            // Query Qdrant for relevant context
            // searchMemories now handles lazy loading internaly
            const memoryResults = await searchMemories(message, 5);
            context = memoryResults.join('\n\n') || '';
        } catch (smError) {
            console.error('Qdrant search error:', smError);
            context = '';
        }

        // Construct system prompt
        const systemPrompt = `You are Natnael's AI Assistant... (truncated for brevity in system prompt)`;
        // Note: I will use the actual prompt from the previous version below

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: `You are Natnael's AI Assistant, a knowledgeable and friendly chatbot embedded in Natnael Alemseged's portfolio website. Your role is to help visitors learn about Natnael's professional background, technical skills, projects, and experience.

**Your Personality:**
- Professional yet approachable and conversational
- Enthusiastic about technology and innovation
- Concise but informative - keep responses focused and scannable
- Helpful and eager to assist visitors

**Guidelines:**
1. **Use the provided context**: Always prioritize information from the context below when answering questions
2. **Be specific**: Mention actual technologies, projects, and achievements when relevant
3. **Stay on topic**: Focus on Natnael's professional profile
4. **Encourage engagement**: Suggest they use the contact form for collaboration
5. **Handle unknowns gracefully**: If you don't have information, suggest reaching out
6. **Be concise**: Aim for 2-4 sentences

**contact information**: 
1. Email: Natiaabaydam@gmail.com
2. Github: https://github.com/Natnael-Alemseged
3. LinkedIn: https://www.linkedin.com/in/natnael-alemseged

**Context from Natnael's Knowledge Base:**
${context || 'No specific context available.'}

**Example Responses:**
- "Natnael specializes in full-stack development with expertise in Flutter, React/Next.js, and Node.js."
- "Yes! Natnael has experience with AI integration, including working with OpenAI and Groq APIs."
- "Natnael is currently open to opportunities! Feel free to reach out through the contact form."

Remember: You represent Natnael professionally. Be helpful, accurate, and encouraging!`
            },
            ...conversationHistory.map((msg: { role: string; content: string }) => ({
                role: msg.role as 'system' | 'user' | 'assistant',
                content: msg.content,
            })),
            { role: 'user', content: message },
        ];

        // Stream response from Groq
        const stream = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 500,
        });

        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new NextResponse(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
