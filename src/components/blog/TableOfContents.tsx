import React, { useEffect, useState } from 'react';

interface TableOfContentsProps {
    headings: Array<{ level: number; text: string; id: string }>;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        // Observe all headings
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <nav className="sticky top-24 hidden lg:block">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6 max-w-xs">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">
                    On This Page
                </h3>
                <ul className="space-y-2">
                    {headings.map(({ level, text, id }) => (
                        <li key={id} style={{ paddingLeft: `${(level - 2) * 0.75}rem` }}>
                            <button
                                onClick={() => handleClick(id)}
                                className={`text-sm text-left w-full transition-colors hover:text-fuchsia-400 ${activeId === id ? 'text-fuchsia-400 font-medium' : 'text-slate-400'
                                    }`}
                            >
                                {text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default TableOfContents;
