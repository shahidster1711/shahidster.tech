import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-2 mt-12">
            {/* Previous button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${currentPage === 1
                        ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-fuchsia-400'
                    }`}
                aria-label="Previous page"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                            ...
                        </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`min-w-[40px] h-10 rounded-lg font-medium text-sm transition-all ${isActive
                                ? 'bg-fuchsia-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-fuchsia-400'
                            }`}
                    >
                        {pageNum}
                    </button>
                );
            })}

            {/* Next button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${currentPage === totalPages
                        ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-fuchsia-400'
                    }`}
                aria-label="Next page"
            >
                <ChevronRight size={20} />
            </button>
        </nav>
    );
};

export default Pagination;
