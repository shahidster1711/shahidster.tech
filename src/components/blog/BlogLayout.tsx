import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

interface BlogLayoutProps {
    children: React.ReactNode;
    showBackButton?: boolean;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, showBackButton = true }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-fuchsia-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-slate-100 hover:text-fuchsia-400 transition-colors group"
                    >
                        <Home size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-lg hidden sm:inline">shahidster.tech</span>
                    </Link>

                    {showBackButton && (
                        <Link
                            to="/blog"
                            className="flex items-center gap-2 text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back to Blog</span>
                            <span className="sm:hidden">Blog</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Main content */}
            <main className="pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900 mt-24">
                <div className="max-w-7xl mx-auto px-6">
                    <p>© {new Date().getFullYear()} Shahid Moosa. Built with React & Tailwind CSS.</p>
                </div>
            </footer>
        </div>
    );
};

export default BlogLayout;
