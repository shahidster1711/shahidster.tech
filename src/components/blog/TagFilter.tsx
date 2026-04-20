import React from 'react';

interface TagFilterProps {
    tags: string[];
    selectedTag: string | null;
    onTagSelect: (tag: string | null) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onTagSelect }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {/* All tags button */}
            <button
                onClick={() => onTagSelect(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedTag === null
                        ? 'bg-fuchsia-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                    }`}
            >
                All Posts
            </button>

            {/* Individual tag buttons */}
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => onTagSelect(tag)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedTag === tag
                            ? 'bg-fuchsia-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                        }`}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
};

export default TagFilter;
