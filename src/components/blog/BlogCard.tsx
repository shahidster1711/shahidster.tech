import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import { BlogPost } from '../../lib/markdown';
import { formatDate } from '../../lib/markdown';

interface BlogCardProps {
    post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
    return (
        <article className="group relative bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-all overflow-hidden">
            {/* Featured image if available */}
            {post.image && (
                <div className="aspect-video overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="p-6">
                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readingTime} min read
                    </span>
                </div>

                {/* Title */}
                <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-fuchsia-400 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-slate-400 line-clamp-3 mb-4">
                    {post.description}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800/50 text-fuchsia-400 text-xs rounded-md font-medium"
                            >
                                <TagIcon size={12} />
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 text-slate-500 text-xs">
                                +{post.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 border-2 border-fuchsia-500/0 group-hover:border-fuchsia-500/20 rounded-xl transition-all pointer-events-none" />
        </article>
    );
};

export default BlogCard;
