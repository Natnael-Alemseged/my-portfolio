'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { ChatUIMessage } from '@/lib/chat-tools';
import { ProjectCards, ResumeLink, ToolStatus } from '@/components/ChatToolResults';

// The model sometimes imitates the "[Showed ...]" history notes below in its
// own replies. Strip complete notes anywhere, and a note still streaming in at
// the start, so they never reach the visitor or get fed back as history.
const HISTORY_NOTE = /^\[Showed [^\]\n]*\][ \t]*\n?/gm;
const PARTIAL_HISTORY_NOTE = /^\[Showed[^\]\n]*$/;

function stripHistoryNotes(text: string) {
    return text.replace(HISTORY_NOTE, '').replace(PARTIAL_HISTORY_NOTE, '').trimStart();
}

// Flattens a message to plain text for the server's conversation history.
// Tool results become a short note so the model can resolve follow-ups like
// "tell me more about the second one".
function toHistoryText(message: ChatUIMessage) {
    return message.parts
        .map((part) => {
            if (part.type === 'text') return stripHistoryNotes(part.text);
            if (part.type === 'tool-showProjects' && part.state === 'output-available') {
                const shown = part.output.projects.map((p) => `${p.title} (slug: ${p.slug})`).join(', ');
                return shown ? `[Showed project cards: ${shown}]` : '';
            }
            if (part.type === 'tool-showResume' && part.state === 'output-available') {
                return `[Showed resume: ${part.output.label}]`;
            }
            return '';
        })
        .filter(Boolean)
        .join('\n');
}

function hasVisibleContent(message: ChatUIMessage) {
    return message.parts.some((part) =>
        (part.type === 'text' && stripHistoryNotes(part.text).trim()) || part.type.startsWith('tool-')
    );
}

const chatTransport = new DefaultChatTransport<ChatUIMessage>({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ messages }) => {
        const latest = messages[messages.length - 1];
        return {
            body: {
                message: latest ? toHistoryText(latest) : '',
                conversationHistory: messages
                    .slice(0, -1)
                    .map((msg) => ({ role: msg.role, content: toHistoryText(msg) }))
                    .filter((msg) => msg.content),
            },
        };
    },
});

const INITIAL_HEADER = `ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL
INITIALIZING BIOMETRIC SCAN...
IDENTITY CONFIRMED: VISITOR.`;

const INITIAL_GREETING = `Greetings. I am Natnael's Automated Persona. How may I assist you?`;

const markdownComponents = {
    p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-2 last:mb-0 leading-relaxed text-sm md:text-base font-mono" style={{ textShadow: '0 0 2px #00ff99' }}>{children}</p>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-extrabold text-[#00ff99] brightness-125" style={{ textShadow: '0 0 4px #00ff99' }}>{children}</strong>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-disc list-inside space-y-1 my-2 text-sm md:text-base font-mono">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal list-inside space-y-1 my-2 text-sm md:text-base font-mono">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed" style={{ textShadow: '0 0 2px #00ff99' }}>{children}</li>
    ),
    a: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 hover:bg-[#00ff99] hover:text-black transition-colors"
            style={{ textShadow: '0 0 2px #00ff99' }}
            {...props}
        >
            {children}
        </a>
    )
};

function renderAssistantPart(part: ChatUIMessage['parts'][number], key: string) {
    switch (part.type) {
        case 'text':
            return (
                <ReactMarkdown key={key} remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {stripHistoryNotes(part.text)}
                </ReactMarkdown>
            );
        case 'tool-showProjects':
            if (part.state === 'output-available') {
                return <ProjectCards key={key} projects={part.output.projects} />;
            }
            if (part.state === 'output-error') {
                return <ToolStatus key={key} label="ERROR: PROJECT LOOKUP FAILED" isError />;
            }
            return <ToolStatus key={key} label="QUERYING PROJECT ARCHIVE..." />;
        case 'tool-showResume':
            if (part.state === 'output-available') {
                return <ResumeLink key={key} {...part.output} />;
            }
            if (part.state === 'output-error') {
                return <ToolStatus key={key} label="ERROR: RESUME LOOKUP FAILED" isError />;
            }
            return <ToolStatus key={key} label="RETRIEVING PERSONNEL FILE..." />;
        default:
            return null;
    }
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, setMessages, sendMessage, status, error } = useChat<ChatUIMessage>({
        transport: chatTransport,
    });
    const [input, setInput] = useState('');
    const isLoading = status === 'submitted' || status === 'streaming';
    const lastMessage = messages[messages.length - 1];
    const isAwaitingContent = isLoading && !(lastMessage?.role === 'assistant' && hasVisibleContent(lastMessage));
    const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
    const [showHeader, setShowHeader] = useState(false);
    const [greetingText, setGreetingText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const introTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const greetingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isIntroAnimating = isOpen && !hasPlayedIntro;

    useEffect(() => {
        // Smooth scrolling gets interrupted by rapid streaming updates and can
        // stop short of the newest text, so jump instantly while streaming.
        messagesEndRef.current?.scrollIntoView({ behavior: status === 'streaming' ? 'auto' : 'smooth' });
    }, [messages, isOpen, greetingText, status]);

    useEffect(() => {
        if (!isOpen || hasPlayedIntro) return;

        // Clear any existing timers
        if (introTimeoutRef.current) {
            clearTimeout(introTimeoutRef.current);
        }
        if (greetingIntervalRef.current) {
            clearInterval(greetingIntervalRef.current);
        }

        // Step 1: Show header instantly
        setShowHeader(true);
        setGreetingText('');

        // Step 2: Wait 100ms with cursor, then stream greeting extremely quickly
        introTimeoutRef.current = setTimeout(() => {
            let index = 0;
            greetingIntervalRef.current = setInterval(() => {
                index += 2;
                setGreetingText(INITIAL_GREETING.slice(0, index));

                if (index >= INITIAL_GREETING.length) {
                    if (greetingIntervalRef.current) {
                        clearInterval(greetingIntervalRef.current);
                        greetingIntervalRef.current = null;
                    }
                    setHasPlayedIntro(true);
                    setShowHeader(false);
                    setGreetingText('');
                    // Set the complete message
                    setMessages((prev) =>
                        prev.length ? prev : [{
                            id: 'greeting',
                            role: 'assistant',
                            parts: [{ type: 'text', text: `${INITIAL_HEADER}\n\n${INITIAL_GREETING}` }],
                        }]
                    );
                }
            }, 10);
        }, 100);

        return () => {
            if (introTimeoutRef.current) {
                clearTimeout(introTimeoutRef.current);
                introTimeoutRef.current = null;
            }
            if (greetingIntervalRef.current) {
                clearInterval(greetingIntervalRef.current);
                greetingIntervalRef.current = null;
            }
        };
    }, [isOpen, hasPlayedIntro, setMessages]);

    const handleSend = () => {
        if (!input.trim() || isLoading || !hasPlayedIntro) return;

        sendMessage({ text: input.trim() });
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Toggle Button - Terminal Style */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 group p-4 bg-black border-2 border-[#00ff99] text-[#00ff99] rounded-full shadow-[0_0_20px_rgba(0,255,153,0.4)] transition-all duration-300 hover:scale-110 hover:bg-[#00ff99] hover:text-black ${isOpen ? 'hidden' : 'flex'}`}
                aria-label="Open Terminal Chat"
            >
                <Terminal size={24} className="animate-pulse" />
            </button>

            {/* Chat Window - RobCo Terminal Style */}
            <div
                className={`fixed bottom-6 right-6 z-50 w-[95vw] md:w-[450px] h-[600px] max-h-[80vh] bg-black border-2 border-[#00ff99] flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'}`}
            >
                {/* CRT Overlay Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-20 z-10" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,153,0.03) 0px, rgba(0,255,153,0.03) 1px, transparent 1px, transparent 2px)',
                }}></div>
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(0,255,153,0)_60%,rgba(0,0,0,0.6)_100%)] z-20"></div>

                {/* Header */}
                <div className="p-3 border-b-2 border-[#00ff99] flex justify-between items-center bg-[#00ff99] text-black z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border border-black flex items-center justify-center bg-black text-[#00ff99]">
                            <Cpu size={14} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-widest font-mono">ROBCO TERMINAL</h3>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-black hover:bg-black hover:text-[#00ff99] border border-transparent hover:border-black p-1 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-black z-30 font-mono text-[#00ff99]">
                    {isIntroAnimating && (
                        <div className="flex flex-col items-start">
                            <div className="uppercase text-[10px] mb-1 text-[#00ff99]/70">
                                &gt; SYSTEM_RESPONSE
                            </div>
                            <div className="max-w-[90%] p-2">
                                <span
                                    className="whitespace-pre-wrap leading-relaxed text-sm md:text-base"
                                    style={{ textShadow: '0 0 2px #00ff99' }}
                                >
                                    {showHeader && INITIAL_HEADER}
                                    {showHeader && greetingText && '\n\n'}
                                    {greetingText}
                                </span>
                                <span className="inline-block w-2 h-4 bg-[#00ff99] ml-1 animate-pulse align-middle"></span>
                            </div>
                        </div>
                    )}
                    {messages.filter((msg) => msg.role === 'user' || hasVisibleContent(msg)).map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`uppercase text-[10px] mb-1 text-[#00ff99]/70`}>
                                {msg.role === 'user' ? '> USER_INPUT' : '> SYSTEM_RESPONSE'}
                            </div>
                            <div className={`max-w-[90%] p-2 ${msg.role === 'user'
                                ? 'border border-[#00ff99]/50 bg-[#00ff99]/10'
                                : 'w-full'
                                }`}>
                                {msg.role === 'user' ? (
                                    <span className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-mono" style={{
                                        textShadow: '0 0 2px #00ff99'
                                    }}>
                                        {toHistoryText(msg)}
                                    </span>
                                ) : (
                                    <div className="font-mono">
                                        {msg.parts.map((part, idx) => renderAssistantPart(part, `${msg.id}-${idx}`))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {error && !isLoading && (
                        <div className="flex flex-col items-start">
                            <div className="uppercase text-[10px] mb-1 text-[#00ff99]/70">&gt; SYSTEM_RESPONSE</div>
                            <div className="max-w-[90%] p-2 whitespace-pre-wrap text-sm md:text-base font-mono" style={{ textShadow: '0 0 2px #00ff99' }}>
                                {'ERROR: CONNECTION LOST\nPlease try again later.'}
                            </div>
                        </div>
                    )}
                    {isAwaitingContent && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 text-[#00ff99] animate-pulse">
                                <span className="w-3 h-5 bg-[#00ff99] block"></span>
                                <span className="text-xs font-mono tracking-widest">PROCESSING DATA...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t-2 border-[#00ff99] bg-black z-30">
                    <div className="relative flex items-center group">
                        <span className="absolute left-3 text-[#00ff99] font-mono font-bold">{'>'}</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isIntroAnimating ? 'BOOTING TERMINAL...' : 'ENTER COMMAND...'}
                            disabled={isLoading || isIntroAnimating}
                            className="w-full bg-black border border-[#00ff99]/50 text-[#00ff99] pl-8 pr-20 py-3 text-sm font-mono focus:outline-none focus:border-[#00ff99] focus:shadow-[0_0_15px_rgba(0,255,153,0.3)] transition-all placeholder:text-[#00ff99]/30 placeholder:uppercase disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim() || isIntroAnimating}
                            className="absolute right-2 p-2 text-[#00ff99] hover:bg-[#00ff99] hover:text-black transition-colors disabled:opacity-30"
                        >
                            <div className="font-bold text-xs px-1">SEND</div>
                        </button>
                    </div>
                    <div className="mt-2 flex justify-between items-center px-1">
                        <p className="text-[10px] text-[#00ff99]/60 font-mono uppercase">V.2.5.0 // NATNAEL AI</p>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[#00ff99]/20"></div>
                            <div className="w-2 h-2 bg-[#00ff99]/60"></div>
                            <div className="w-2 h-2 bg-[#00ff99]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
