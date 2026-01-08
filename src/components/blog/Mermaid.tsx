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
    const [error, setError] = React.useState<string>('');

    useEffect(() => {
        const renderChart = async () => {
            if (!containerRef.current || !chart) return;

            try {
                // Generate unique ID for this chart
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                // Render the chart (initialization happens once in App.tsx)
                const { svg: renderedSvg } = await mermaid.render(id, chart);
                setSvg(renderedSvg);
                setError('');
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Failed to render diagram');
            }
        };

        renderChart();
    }, [chart]);

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 my-4">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <figure className={`my-12 ${className}`}>
            <div
                ref={containerRef}
                className="mermaid-container flex justify-center overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
            {caption && (
                <figcaption className="mt-4 text-center text-sm text-slate-500 italic max-w-2xl mx-auto italic font-medium border-l-2 border-fuchsia-500/30 pl-4 py-2">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};

export default Mermaid;
