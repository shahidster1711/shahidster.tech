import React, { useState, useMemo } from 'react';
import { BookOpen, Search } from 'lucide-react';
import BlogLayout from '../components/blog/BlogLayout';
import BlogCard from '../components/blog/BlogCard';
import TagFilter from '../components/blog/TagFilter';
import Pagination from '../components/blog/Pagination';
import SEO from '../components/SEO';
import { getAllBlogPosts } from '../lib/blog-posts';
import { getAllTags, filterPostsByTag, searchPosts, paginatePosts } from '../lib/blog-utils';
import { generateBlogListSEO } from '../lib/seo-utils';

const POSTS_PER_PAGE = 9;

const BlogListPage: React.FC = () => {
    const allPosts = getAllBlogPosts();
    const allTags = getAllTags(allPosts);

    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and search posts
    const filteredPosts = useMemo(() => {
        let posts = allPosts;

        // Apply tag filter
        if (selectedTag) {
            posts = filterPostsByTag(posts, selectedTag);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            posts = searchPosts(posts, searchQuery);
        }

        return posts;
    }, [allPosts, selectedTag, searchQuery]);

    // Paginate filtered posts
    const { posts: paginatedPosts, totalPages } = paginatePosts(
        filteredPosts,
        currentPage,
        POSTS_PER_PAGE
    );

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedTag, searchQuery]);

    const seoMetadata = generateBlogListSEO('https://shahidster.tech');

    return (
        <BlogLayout showBackButton={false}>
            <SEO
                title={seoMetadata.title}
                description={seoMetadata.description}
                url={seoMetadata.openGraph.url}
                type={seoMetadata.openGraph.type as 'website' | 'article'}
            />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen size={32} className="text-fuchsia-400" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
                            Engineering Logs
                        </h1>
                    </div>
                    <p className="text-xl text-slate-400 max-w-3xl">
                        Deep dives into distributed systems, database reliability, and cloud architecture.
                        Technical notes from production—no fluff, just engineering.
                    </p>
                </header>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500"
                        />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Tag Filter */}
                {allTags.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Filter by Topic
                        </h2>
                        <TagFilter
                            tags={allTags}
                            selectedTag={selectedTag}
                            onTagSelect={setSelectedTag}
                        />
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-6 text-sm text-slate-500">
                    {filteredPosts.length === allPosts.length ? (
                        <span>Showing all {allPosts.length} posts</span>
                    ) : (
                        <span>
                            Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                            {selectedTag && ` in "${selectedTag}"`}
                            {searchQuery && ` matching "${searchQuery}"`}
                        </span>
                    )}
                </div>

                {/* Blog Posts Grid */}
                {paginatedPosts.length > 0 ? (
                    <>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                            {paginatedPosts.map((post) => (
                                <BlogCard key={post.slug} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-slate-400 mb-4">No posts found</p>
                        <p className="text-slate-500">
                            Try adjusting your search or filter criteria
                        </p>
                        {(selectedTag || searchQuery) && (
                            <button
                                onClick={() => {
                                    setSelectedTag(null);
                                    setSearchQuery('');
                                }}
                                className="mt-6 px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </BlogLayout>
    );
};

export default BlogListPage;
