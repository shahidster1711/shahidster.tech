import { BlogPost } from './markdown';

/**
 * Get all unique tags from blog posts
 */
export function getAllTags(posts: BlogPost[]): string[] {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
        post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}

/**
 * Filter posts by tag
 */
export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
    return posts.filter((post) => post.tags.includes(tag));
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
    return [...posts].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

/**
 * Paginate posts
 */
export function paginatePosts(
    posts: BlogPost[],
    page: number,
    postsPerPage: number = 10
): {
    posts: BlogPost[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
} {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return {
        posts: paginatedPosts,
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
}

/**
 * Get related posts based on shared tags
 */
export function getRelatedPosts(
    currentPost: BlogPost,
    allPosts: BlogPost[],
    limit: number = 3
): BlogPost[] {
    const otherPosts = allPosts.filter((post) => post.slug !== currentPost.slug);

    // Calculate similarity score based on shared tags
    const postsWithScores = otherPosts.map((post) => {
        const sharedTags = post.tags.filter((tag) =>
            currentPost.tags.includes(tag)
        );
        return {
            post,
            score: sharedTags.length,
        };
    });

    // Sort by score (descending) and return top N
    return postsWithScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.post);
}

/**
 * Search posts by title or description
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
    const lowerQuery = query.toLowerCase();
    return posts.filter(
        (post) =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.description.toLowerCase().includes(lowerQuery)
    );
}
