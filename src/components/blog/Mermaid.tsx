import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
    caption?: string;
    className?: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, caption, className = '' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = React.useState<string>('');
    const [error, setError] = React.useState<boolean>(false);
    const [isClient, setIsClient] = React.useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !chart || !containerRef.current) return;

        const renderChart = async () => {
            try {
                // Unique, stable ID for this instance
                const id = `mermaid-${Math.abs(chart.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).toString(36)}`;

                // Clear state before re-rendering
                setError(false);

                // Ensure mermaid is initialized (though usually done in main.tsx)
                const { svg: renderedSvg } = await mermaid.render(id, chart);
                setSvg(renderedSvg);
            } catch (err) {
                console.error('Mermaid rendering failed:', err);
                setError(true);
            }
        };

        renderChart();
    }, [chart, isClient]);

    if (!isClient) {
        return <div className="animate-pulse bg-slate-900/50 h-64 rounded-xl my-12" />;
    }

    if (error) {
        return (
            <div className="bg-slate-900/80 border border-red-500/30 rounded-xl p-6 my-12 text-center">
                <p className="text-red-400 text-sm font-mono mb-2">Diagram Syntax Error</p>
                <div className="text-xs text-slate-500 overflow-x-auto p-4 bg-slate-950 rounded border border-slate-800 text-left">
                    <code>{chart}</code>
                </div>
            </div>
        );
    }

    return (
        <figure className={`my-12 flex flex-col items-center ${className}`}>
            <div
                ref={containerRef}
                className="mermaid-container w-full flex justify-center overflow-x-auto py-4"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
            {caption && (
                <figcaption className="mt-4 text-center text-sm text-slate-500 max-w-2xl mx-auto italic font-medium border-l-2 border-fuchsia-500/30 pl-4 py-2">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};

export default Mermaid;
