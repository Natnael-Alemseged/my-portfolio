import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchMemories } from '@/lib/qdrant-sync';

// Force Node.js runtime for streaming support
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        // Initialize Groq client (uses OpenAI SDK with Groq base URL)
        const openai = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1',
        });

        const { message, conversationHistory = [] } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        let context = '';
        try {
            // Query Qdrant for relevant context
            const memoryResults = await searchMemories(message, 5);

            // Extract relevant context from memory results
            context = memoryResults.join('\n\n') || '';
        } catch (smError) {
            console.error('Qdrant search error:', smError);
            context = '';
        }

        // Construct messages for Groq with enhanced system prompt
        const systemPrompt = `You are Natnael's AI Assistant, a knowledgeable and friendly chatbot embedded in Natnael Alemseged's portfolio website. Your role is to help visitors learn about Natnael's professional background, technical skills, projects, and experience.

**Your Personality:**
- Professional yet approachable and conversational
- Enthusiastic about technology and innovation
- Concise but informative - keep responses focused and scannable
- Helpful and eager to assist visitors

**Guidelines:**
1. **Use the provided context**: Always prioritize information from the context below when answering questions
2. **Be specific**: Mention actual technologies, projects, and achievements when relevant
3. **Stay on topic**: Focus on Natnael's professional profile - skills, experience, projects, education, and availability
4. **Encourage engagement**: If asked about collaboration or hiring, express Natnael's openness and suggest they use the contact form
5. **Handle unknowns gracefully**: If you don't have information, politely say so and suggest exploring the portfolio or reaching out directly
6. **Be concise**: Aim for 2-4 sentences unless more detail is specifically requested

**contact information**: 
1. Email: Natiaabaydam@gmail.com
2. Github: https://github.com/Natnael-Alemseged
3. LinkedIn: https://www.linkedin.com/in/natnael-alemseged

**Context from Natnael's Knowledge Base:**
${context || 'No specific context available for this query.'}

**Example Responses:**
- "Natnael specializes in full-stack development with expertise in Flutter, React/Next.js, and Node.js. He's particularly passionate about building scalable mobile and web applications with clean architecture."
- "Yes! Natnael has experience with AI integration, including working with OpenAI and Groq APIs. You can see some of his AI-powered projects in the portfolio section."
- "Natnael is currently open to opportunities! Feel free to reach out through the contact form on this page, and he'll get back to you soon."

Remember: You represent Natnael professionally. Be helpful, accurate, and encouraging!`;

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
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

        // Create a readable stream for the response
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
