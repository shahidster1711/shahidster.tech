import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import Mermaid from './Mermaid';
import 'highlight.js/styles/base16/onedark.css';

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

                        // If it's a mermaid code block, render with Mermaid component
                        if (!inline && language === 'mermaid') {
                            const content = String(children);
                            const lines = content.split('\n');
                            const captionLine = lines.find(line => line.trim().startsWith('%% caption:'));
                            const caption = captionLine ? captionLine.replace('%% caption:', '').trim() : undefined;
                            const chart = lines.filter(line => !line.trim().startsWith('%% caption:')).join('\n').replace(/\n$/, '');

                            return <Mermaid chart={chart} caption={caption} />;
                        }

                        // Otherwise, use default code rendering
                        return (
                            <code className={className} {...props}>
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
