import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Calendar, Clock, Tag as TagIcon, Share2 } from 'lucide-react';
import BlogLayout from '../components/blog/BlogLayout';
import MarkdownRenderer from '../components/blog/MarkdownRenderer';
import TableOfContents from '../components/blog/TableOfContents';
import SEO from '../components/SEO';
import { getBlogPostBySlug, getAllBlogPosts } from '../lib/blog-posts';
import { getRelatedPosts } from '../lib/blog-utils';
import { generateBlogPostSEO } from '../lib/seo-utils';
import { formatDate, extractHeadings } from '../lib/markdown';
import { PILLAR_PAGE, CLUSTER_ARTICLES } from '../lib/blog-graph';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = slug ? getBlogPostBySlug(slug) : undefined;
    const allPosts = getAllBlogPosts();

    // Redirect to 404 if post not found
    if (!post) {
        return <Navigate to="/404" replace />;
    }

    const relatedPosts = getRelatedPosts(post, allPosts, 3);
    const headings = extractHeadings(post.content);
    const seoMetadata = generateBlogPostSEO(post, 'https://shahidster.tech');

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <BlogLayout>
            <SEO
                title={seoMetadata.title}
                description={seoMetadata.description}
                url={seoMetadata.openGraph.url}
                image={seoMetadata.openGraph.image}
                author={seoMetadata.article?.author || post.author}
                publishedTime={seoMetadata.article?.publishedTime}
                tags={seoMetadata.article?.tags || post.tags}
                type={seoMetadata.openGraph.type as 'website' | 'article'}
                jsonLd={seoMetadata.jsonLd}
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-[1fr_250px] gap-12">
                    {/* Main Content */}
                    <article className="max-w-3xl">
                        {/* Featured Image */}
                        {post.image && (
                            <div className="aspect-video overflow-hidden rounded-2xl mb-8 border border-slate-800">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Header */}
                        <header className="mb-8">
                            {/* Pillar/Cluster Series Callout */}
                            {(() => {
                                const currentPath = `/blog/${post.slug}`;
                                const isPillar = currentPath === PILLAR_PAGE.slug;
                                const clusterEntry = Object.values(CLUSTER_ARTICLES).find(a => a.slug === currentPath);

                                if (clusterEntry) {
                                    return (
                                        <div className="mb-6 p-4 bg-fuchsia-900/10 border-l-4 border-fuchsia-500 rounded-r-lg">
                                            <p className="text-sm text-fuchsia-300 font-medium mb-1">Engineering Series</p>
                                            <p className="text-slate-200">
                                                This post is part of the <Link to={PILLAR_PAGE.slug} className="text-fuchsia-400 hover:underline font-bold">{PILLAR_PAGE.title}</Link> series.
                                            </p>
                                        </div>
                                    );
                                }

                                if (isPillar) {
                                    return (
                                        <div className="mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                                            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                                                <div className="w-2 h-6 bg-fuchsia-500 rounded-full"></div>
                                                Series Curriculum
                                            </h3>
                                            <div className="grid gap-3">
                                                {Object.values(CLUSTER_ARTICLES).map((article, idx) => (
                                                    <Link
                                                        key={article.slug}
                                                        to={article.slug}
                                                        className="group flex items-center gap-4 p-3 hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-700"
                                                    >
                                                        <span className="text-fuchsia-500 font-mono text-sm font-bold">0{idx + 1}</span>
                                                        <span className="text-slate-300 group-hover:text-fuchsia-300 transition-colors font-medium">{article.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <p className="text-xl text-slate-400 mb-6">
                                {post.description}
                            </p>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 border-b border-slate-800">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={16} />
                                    {formatDate(post.date)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock size={16} />
                                    {post.readingTime} min read
                                </span>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1.5 hover:text-fuchsia-400 transition-colors ml-auto"
                                    aria-label="Share post"
                                >
                                    <Share2 size={16} />
                                    Share
                                </button>
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {post.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            to={`/blog?tag=${encodeURIComponent(tag)}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 text-fuchsia-400 text-sm rounded-lg font-medium hover:bg-slate-800 transition-colors"
                                        >
                                            <TagIcon size={14} />
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </header>

                        {/* Markdown Content */}
                        <div className="mb-16">
                            <MarkdownRenderer content={post.content} />
                        </div>

                        {/* Author Bio */}
                        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 mb-12">
                            <h3 className="text-lg font-bold text-slate-100 mb-2">About the Author</h3>
                            <p className="text-slate-400 mb-4">
                                <strong className="text-slate-300">{post.author}</strong> is a Cloud Database Support Engineer
                                specializing in distributed systems, AWS, and SingleStore. He helps teams build scalable,
                                reliable data infrastructure.
                            </p>
                            <Link
                                to="/#contact"
                                className="text-fuchsia-400 hover:text-fuchsia-300 font-medium text-sm"
                            >
                                Get in touch →
                            </Link>
                        </div>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100 mb-6">Related Posts</h2>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.slug}
                                            to={`/blog/${relatedPost.slug}`}
                                            className="group block bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 p-4 transition-all"
                                        >
                                            <h3 className="font-bold text-slate-200 mb-2 group-hover:text-fuchsia-400 transition-colors line-clamp-2">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 line-clamp-2">
                                                {relatedPost.description}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>

                    {/* Sidebar - Table of Contents */}
                    {headings.length > 0 && <TableOfContents headings={headings} />}
                </div>
            </div>
        </BlogLayout>
    );
};

export default BlogPostPage;
