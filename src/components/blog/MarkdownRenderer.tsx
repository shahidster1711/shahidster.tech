import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { Copy, Check } from 'lucide-react';
import Mermaid from './Mermaid';
import 'highlight.js/styles/base16/onedark.css';

const CodeBlock: React.FC<{ language: string; children: any }> = ({ language, children }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden my-6 border border-slate-800 bg-[#1a1b26]">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{language}</span>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-fuchsia-400 transition-all flex items-center gap-1.5"
                >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    <span className="text-[10px] uppercase font-bold tracking-tight">{copied ? 'Copied' : 'Copy'}</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <pre className="!bg-transparent !m-0 !p-4">
                    <code className={`language-${language} !bg-transparent`}>
                        {children}
                    </code>
                </pre>
            </div>
        </div>
    );
};

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <div className="prose">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
                components={{
                    // Render Mermaid diagrams
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';

                        if (!inline && language === 'mermaid') {
                            const content = String(children);
                            const lines = content.split('\n');
                            const captionLine = lines.find(line => line.trim().startsWith('%% caption:'));
                            const caption = captionLine ? captionLine.replace('%% caption:', '').trim() : undefined;
                            const chart = lines.filter(line => !line.trim().startsWith('%% caption:')).join('\n').replace(/\n$/, '');

                            return <Mermaid chart={chart} caption={caption} />;
                        }

                        if (!inline && match) {
                            return (
                                <CodeBlock language={language} {...props}>
                                    {children}
                                </CodeBlock>
                            );
                        }

                        return (
                            <code className={`${className} px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-sm`} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Custom link handling for external links
                    a: ({ node, ...props }) => (
                        <a
                            {...props}
                            target={props.href?.startsWith('http') ? '_blank' : undefined}
                            rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
