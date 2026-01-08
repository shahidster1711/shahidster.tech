import {
    BlogPost,
    parseMarkdownWithFrontmatter,
    calculateReadingTime,
} from './markdown';

// Dynamically import all markdown files from content/blog directory
// Vite 5 syntax: query: '?raw', import: 'default'
// TODO: Consider lazy loading for performance once API can be made async
// Current limitation: Synchronous API requires eager loading
const blogPostModules = import.meta.glob('../content/blog/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

/**
 * Parse and process all blog posts
 */
function processBlogPosts(): BlogPost[] {
    const posts: BlogPost[] = [];

    try {
        for (const [filepath, moduleContent] of Object.entries(blogPostModules)) {
            // Ensure content is a string
            const markdownContent = moduleContent as string;

            if (typeof markdownContent !== 'string') {
                console.error(`Blog post at ${filepath} is not a string. Received:`, typeof markdownContent);
                continue;
            }

            // Extract filename without extension for default slug
            const filename = filepath.split('/').pop()?.replace(/\.md$/, '') || '';

            const { frontmatter, content } = parseMarkdownWithFrontmatter(markdownContent);

            const post: BlogPost = {
                slug: frontmatter.slug || filename,
                title: frontmatter.title || 'Untitled',
                description: frontmatter.description || '',
                date: frontmatter.date || new Date().toISOString().split('T')[0],
                tags: frontmatter.tags || [],
                author: frontmatter.author || 'Shahid Moosa',
                image: frontmatter.image,
                content,
                readingTime: calculateReadingTime(content),
            };

            posts.push(post);
        }
    } catch (error) {
        console.error('Error processing blog posts:', error);
    }

    return posts;
}

// Export processed blog posts
export const allBlogPosts = processBlogPosts();

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    return allBlogPosts.find((post) => post.slug === slug);
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllBlogPosts(): BlogPost[] {
    return [...allBlogPosts].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

/**
 * Get featured blog posts (first N)
 */
export function getFeaturedBlogPosts(limit: number = 3): BlogPost[] {
    return getAllBlogPosts().slice(0, limit);
}
