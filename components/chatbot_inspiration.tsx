import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Terminal, Cpu } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { PROFILE } from '../constants';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: `ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL\nINITIALIZING BIOMETRIC SCAN...\nIDENTITY CONFIRMED: VISITOR.\n\nGreetings. I am ${PROFILE.name.split(' ')[0]}'s Automated Persona. How may I assist you?`, timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Convert chat history to Gemini format
        const historyForGemini = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const responseText = await generateChatResponse(input, historyForGemini);

        const botMessage: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Toggle Button - Vault Boy Style */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 group p-4 bg-black border-2 border-pipboy text-pipboy rounded-full shadow-[0_0_20px_rgba(20,241,149,0.4)] transition-all duration-300 hover:scale-110 hover:bg-pipboy hover:text-black ${isOpen ? 'hidden' : 'flex'}`}
                aria-label="Open Pip-Boy Chat"
            >
                <Terminal size={24} className="animate-pulse" />
            </button>

            {/* Chat Window - RobCo Terminal Style */}
            <div
                className={`fixed bottom-6 right-6 z-50 w-[95vw] md:w-[450px] h-[600px] max-h-[80vh] bg-black pipboy-border flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'}`}
            >
                {/* CRT Overlay Effect */}
                <div className="absolute inset-0 pointer-events-none bg-crt-lines opacity-20 z-10"></div>
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(20,241,149,0)_60%,rgba(0,0,0,0.6)_100%)] z-20"></div>

                {/* Header */}
                <div className="p-3 border-b-2 border-pipboy flex justify-between items-center bg-pipboy text-black z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border border-black flex items-center justify-center bg-black text-pipboy">
                            <Cpu size={14} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-widest font-mono">ROBCO TERMINAL</h3>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-black hover:bg-black hover:text-pipboy border border-transparent hover:border-black p-1 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-black z-30 font-mono text-pipboy scrollbar-hide">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`uppercase text-[10px] mb-1 ${msg.role === 'user' ? 'text-pipboy/70' : 'text-pipboy/70'}`}>
                                {msg.role === 'user' ? '> USER_INPUT' : '> SYSTEM_RESPONSE'}
                            </div>
                            <div className={`max-w-[90%] p-2 ${msg.role === 'user'
                                    ? 'border border-pipboy/50 bg-pipboy/10'
                                    : ''
                                }`}>
                                <span className="animate-flicker whitespace-pre-wrap leading-relaxed text-sm md:text-base shadow-[0_0_2px_#14f195]">
                                    {msg.text}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 text-pipboy animate-pulse">
                                <span className="w-3 h-5 bg-pipboy block"></span>
                                <span className="text-xs font-mono tracking-widest">PROCESSING DATA...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t-2 border-pipboy bg-black z-30">
                    <div className="relative flex items-center group">
                        <span className="absolute left-3 text-pipboy font-mono font-bold">{'>'}</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="ENTER COMMAND..."
                            className="w-full bg-black border border-pipboy/50 text-pipboy pl-8 pr-12 py-3 text-sm font-mono focus:outline-none focus:border-pipboy focus:shadow-[0_0_15px_rgba(20,241,149,0.3)] transition-all placeholder:text-pipboy/30 uppercase"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 p-2 text-pipboy hover:bg-pipboy hover:text-black transition-colors disabled:opacity-30"
                        >
                            <div className="font-bold text-xs px-1">SEND</div>
                        </button>
                    </div>
                    <div className="mt-2 flex justify-between items-center px-1">
                        <p className="text-[10px] text-pipboy/60 font-mono uppercase">V.2.5.0 // FLASH</p>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-pipboy/20"></div>
                            <div className="w-2 h-2 bg-pipboy/60"></div>
                            <div className="w-2 h-2 bg-pipboy"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatBot;