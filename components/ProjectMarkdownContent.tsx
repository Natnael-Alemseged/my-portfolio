'use client';

import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Code block with lazy-loaded syntax highlighter (heavy bundle)
const CodeBlock = dynamic(
    () =>
        Promise.all([
            import('react-syntax-highlighter').then((m) => m.Prism),
            import('react-syntax-highlighter/dist/esm/styles/prism').then((m) => m.atomDark),
        ]).then(([Prism, atomDark]) => {
            return function CodeBlock({
                language,
                children,
            }: {
                language: string;
                children: string;
            }) {
                return (
                    <Prism
                        style={atomDark}
                        language={language}
                        PreTag="div"
                        className="rounded-xl border border-emerald-900/30 shadow-[0_0_20px_rgba(0,255,153,0.12)]"
                    >
                        {children.replace(/\n$/, '')}
                    </Prism>
                );
            };
        }),
    { ssr: false, loading: () => <div className="rounded-xl border border-emerald-900/30 bg-gray-900/70 p-4 animate-pulse min-h-[120px]" /> }
);

export default function ProjectMarkdownContent({
    content,
    contentFormat,
}: {
    content: string;
    contentFormat?: string;
}) {
    if (contentFormat === 'html') {
        return (
            <div
                className="prose prose-invert prose-emerald max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }

    const markdownComponents = {
        h2: ({ children }: { children?: React.ReactNode }) => (
            <h2 className="text-2xl font-bold text-[#00ff99] mt-10 mb-4">{children}</h2>
        ),
        h3: ({ children }: { children?: React.ReactNode }) => (
            <h3 className="text-xl font-semibold text-white mt-8 mb-3">{children}</h3>
        ),
        p: ({ children }: { children?: React.ReactNode }) => (
            <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }: { children?: React.ReactNode }) => (
            <ul className="space-y-3 mb-6">{children}</ul>
        ),
        li: ({ children }: { children?: React.ReactNode }) => (
            <li className="flex items-start gap-3 bg-gray-900/70 border border-emerald-900/30 rounded-lg p-3">
                <span className="text-[#00ff99] mt-1">•</span>
                <span className="text-gray-200">{children}</span>
            </li>
        ),
        blockquote: ({ children }: { children?: React.ReactNode }) => (
            <blockquote className="border-l-4 border-[#00ff99] bg-gray-900/50 p-4 rounded-r-lg italic text-emerald-200 mb-6">
                {children}
            </blockquote>
        ),
        strong: ({ children }: { children?: React.ReactNode }) => (
            <strong className="text-white font-semibold">{children}</strong>
        ),
        code: ({ inline, className, children, ...props }: React.ComponentProps<'code'> & { inline?: boolean }) => {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
                return (
                    <CodeBlock language={match[1]}>
                        {String(children)}
                    </CodeBlock>
                );
            }
            return (
                <code className="bg-gray-900/70 text-emerald-200 px-1.5 py-0.5 rounded" {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
        </ReactMarkdown>
    );
}
