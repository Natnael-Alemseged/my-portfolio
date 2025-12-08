'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, Cpu } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const INITIAL_GREETING = `ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL
INITIALIZING BIOMETRIC SCAN...
IDENTITY CONFIRMED: VISITOR.

Greetings. I am Natnael's Automated Persona. How may I assist you?`;

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
    const [introText, setIntroText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const introIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isIntroAnimating = isOpen && !hasPlayedIntro;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, introText]);

    useEffect(() => {
        if (!isOpen || hasPlayedIntro) return;

        if (introIntervalRef.current) {
            clearInterval(introIntervalRef.current);
        }

        let index = 0;
        setIntroText('');

        introIntervalRef.current = setInterval(() => {
            index += 1;
            setIntroText(INITIAL_GREETING.slice(0, index));

            if (index >= INITIAL_GREETING.length) {
                if (introIntervalRef.current) {
                    clearInterval(introIntervalRef.current);
                    introIntervalRef.current = null;
                }
                setHasPlayedIntro(true);
                setIntroText('');
                setMessages((prev) =>
                    prev.length ? prev : [{ role: 'assistant', content: INITIAL_GREETING }]
                );
            }
        }, 30);

        return () => {
            if (introIntervalRef.current) {
                clearInterval(introIntervalRef.current);
                introIntervalRef.current = null;
            }
        };
    }, [isOpen, hasPlayedIntro]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !hasPlayedIntro) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    conversationHistory: messages,
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);
                            assistantMessage += parsed.content;
                            setMessages((prev) => {
                                const newMessages = [...prev];
                                newMessages[newMessages.length - 1].content = assistantMessage;
                                return newMessages;
                            });
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: "ERROR: CONNECTION LOST\nPlease try again later.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
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
                    <button onClick={() => setIsOpen(false)} className="text-black hover:bg-black hover:text-[#00ff99] border border-transparent hover:border-black p-1 transition-colors">
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
                                    {introText || '\u00A0'}
                                </span>
                                <span className="inline-block w-2 h-4 bg-[#00ff99] ml-1 animate-pulse align-middle"></span>
                            </div>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`uppercase text-[10px] mb-1 text-[#00ff99]/70`}>
                                {msg.role === 'user' ? '> USER_INPUT' : '> SYSTEM_RESPONSE'}
                            </div>
                            <div className={`max-w-[90%] p-2 ${msg.role === 'user'
                                ? 'border border-[#00ff99]/50 bg-[#00ff99]/10'
                                : ''
                                }`}>
                                <span className="whitespace-pre-wrap leading-relaxed text-sm md:text-base" style={{
                                    textShadow: '0 0 2px #00ff99'
                                }}>
                                    {msg.content}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
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
                            className="w-full bg-black border border-[#00ff99]/50 text-[#00ff99] pl-8 pr-12 py-3 text-sm font-mono focus:outline-none focus:border-[#00ff99] focus:shadow-[0_0_15px_rgba(0,255,153,0.3)] transition-all placeholder:text-[#00ff99]/30 uppercase disabled:opacity-50"
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
