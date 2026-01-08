import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
    className?: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, className = '' }) => {
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
        <div
            ref={containerRef}
            className={`mermaid-container my-8 flex justify-center ${className}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default Mermaid;
