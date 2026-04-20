import { BlogPost } from '../lib/markdown';

interface SEOMetadata {
    title: string;
    description: string;
    canonical: string;
    openGraph: {
        type: string;
        title: string;
        description: string;
        url: string;
        image?: string;
        siteName: string;
        locale: string;
    };
    twitter: {
        card: string;
        title: string;
        description: string;
        image?: string;
        creator: string;
        site: string;
    };
    article?: {
        publishedTime: string;
        modifiedTime?: string;
        author: string;
        section: string;
        tags: string[];
    };
    jsonLd: any;
}

/**
 * Generate comprehensive SEO metadata for a blog post
 */
export function generateBlogPostSEO(
    post: BlogPost,
    baseUrl: string = 'https://shahidster.tech'
): SEOMetadata {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const imageUrl = post.image ? `${baseUrl}${post.image}` : `${baseUrl}/og-default.png`;

    return {
        title: `${post.title} | Shahid Moosa`,
        description: post.description,
        canonical: postUrl,

        openGraph: {
            type: 'article',
            title: post.title,
            description: post.description,
            url: postUrl,
            image: imageUrl,
            siteName: 'Shahid Moosa - Engineering Blog',
            locale: 'en_US',
        },

        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            image: imageUrl,
            creator: '@shahidmoosa',
            site: '@shahidmoosa',
        },

        article: {
            publishedTime: new Date(post.date).toISOString(),
            author: post.author,
            section: 'Technology',
            tags: post.tags,
        },

        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            image: imageUrl,
            datePublished: new Date(post.date).toISOString(),
            dateModified: new Date(post.date).toISOString(),
            author: {
                '@type': 'Person',
                name: post.author,
                url: baseUrl,
                jobTitle: 'Cloud Database Support Engineer',
                worksFor: {
                    '@type': 'Organization',
                    name: 'SingleStore',
                },
            },
            publisher: {
                '@type': 'Person',
                name: 'Shahid Moosa',
                url: baseUrl,
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': postUrl,
            },
            keywords: post.tags.join(', '),
            articleSection: 'Technology',
            inLanguage: 'en-US',
            isAccessibleForFree: true,
            isPartOf: {
                '@type': 'Blog',
                '@id': `${baseUrl}/blog`,
                name: 'Shahid Moosa - Engineering Blog',
            },
        },
    };
}

/**
 * Generate SEO metadata for blog list page
 */
export function generateBlogListSEO(baseUrl: string = 'https://shahidster.tech'): SEOMetadata {
    const blogUrl = `${baseUrl}/blog`;

    return {
        title: 'Engineering Blog | Shahid Moosa',
        description: 'Deep dives into distributed systems, database reliability, and cloud architecture. Technical insights from production environments.',
        canonical: blogUrl,

        openGraph: {
            type: 'website',
            title: 'Engineering Blog | Shahid Moosa',
            description: 'Deep dives into distributed systems, database reliability, and cloud architecture.',
            url: blogUrl,
            siteName: 'Shahid Moosa - Engineering Blog',
            locale: 'en_US',
        },

        twitter: {
            card: 'summary',
            title: 'Engineering Blog | Shahid Moosa',
            description: 'Deep dives into distributed systems, database reliability, and cloud architecture.',
            creator: '@shahidmoosa',
            site: '@shahidmoosa',
        },

        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': blogUrl,
            name: 'Shahid Moosa - Engineering Blog',
            description: 'Technical blog about distributed systems, databases, and cloud infrastructure',
            url: blogUrl,
            author: {
                '@type': 'Person',
                name: 'Shahid Moosa',
                url: baseUrl,
                jobTitle: 'Cloud Database Support Engineer',
            },
            inLanguage: 'en-US',
        },
    };
}

/**
 * Generate HTML meta tags from SEO metadata
 */
export function generateMetaTags(seo: SEOMetadata): string {
    const tags: string[] = [];

    // Basic meta tags
    tags.push(`<title>${seo.title}</title>`);
    tags.push(`<meta name="description" content="${seo.description}" />`);
    tags.push(`<link rel="canonical" href="${seo.canonical}" />`);

    // Open Graph
    tags.push(`<meta property="og:type" content="${seo.openGraph.type}" />`);
    tags.push(`<meta property="og:title" content="${seo.openGraph.title}" />`);
    tags.push(`<meta property="og:description" content="${seo.openGraph.description}" />`);
    tags.push(`<meta property="og:url" content="${seo.openGraph.url}" />`);
    tags.push(`<meta property="og:site_name" content="${seo.openGraph.siteName}" />`);
    tags.push(`<meta property="og:locale" content="${seo.openGraph.locale}" />`);

    if (seo.openGraph.image) {
        tags.push(`<meta property="og:image" content="${seo.openGraph.image}" />`);
        tags.push(`<meta property="og:image:width" content="1200" />`);
        tags.push(`<meta property="og:image:height" content="630" />`);
    }

    // Twitter Card
    tags.push(`<meta name="twitter:card" content="${seo.twitter.card}" />`);
    tags.push(`<meta name="twitter:title" content="${seo.twitter.title}" />`);
    tags.push(`<meta name="twitter:description" content="${seo.twitter.description}" />`);
    tags.push(`<meta name="twitter:creator" content="${seo.twitter.creator}" />`);
    tags.push(`<meta name="twitter:site" content="${seo.twitter.site}" />`);

    if (seo.twitter.image) {
        tags.push(`<meta name="twitter:image" content="${seo.twitter.image}" />`);
    }

    // Article meta tags
    if (seo.article) {
        tags.push(`<meta property="article:published_time" content="${seo.article.publishedTime}" />`);
        tags.push(`<meta property="article:author" content="${seo.article.author}" />`);
        tags.push(`<meta property="article:section" content="${seo.article.section}" />`);

        seo.article.tags.forEach(tag => {
            tags.push(`<meta property="article:tag" content="${tag}" />`);
        });
    }

    return tags.join('\n');
}

/**
 * Generate JSON-LD script tag
 */
export function generateJsonLdScript(seo: SEOMetadata): string {
    return `<script type="application/ld+json">
${JSON.stringify(seo.jsonLd, null, 2)}
</script>`;
}
