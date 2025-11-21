'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm Natnael's AI assistant. Ask me anything about his skills, projects, or experience!",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

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
                        } catch (e) {
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
                    content: "Sorry, I'm having trouble connecting. Please try again later.",
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
            {/* Chat Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-br from-[#00ff99] to-[#00cc77] text-black shadow-2xl hover:shadow-[#00ff99]/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle chat"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle size={28} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed bottom-24 right-6 z-40 w-[400px] h-[600px] bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#00ff99]/30 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#00ff99] to-[#00cc77] p-4 text-black">
                            <h3 className="font-semibold text-lg">Natnael's AI Assistant</h3>
                            <p className="text-sm text-black/80">Ask me anything about Natnael!</p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-[#00ff99] to-[#00cc77] text-black'
                                                : 'bg-gray-900 text-gray-100 border border-[#00ff99]/20'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-900 border border-[#00ff99]/20 p-3 rounded-2xl">
                                        <Loader2 className="animate-spin text-[#00ff99]" size={20} />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-[#00ff99]/20 bg-black/50 backdrop-blur-sm">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 rounded-full border border-[#00ff99]/30 bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99] disabled:opacity-50"
                                />
                                <motion.button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-full bg-gradient-to-br from-[#00ff99] to-[#00cc77] text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
