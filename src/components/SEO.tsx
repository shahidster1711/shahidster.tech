import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    image?: string;
    author?: string;
    publishedTime?: string;
    tags?: string[];
    type?: 'website' | 'article';
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    url,
    image,
    author = 'Shahid Moosa',
    publishedTime,
    tags,
    type = 'website',
}) => {
    useEffect(() => {
        // Set document title
        document.title = title;

        // Set or update meta tags
        const setMetaTag = (name: string, content: string, property = false) => {
            const attribute = property ? 'property' : 'name';
            let element = document.querySelector(`meta[${attribute}="${name}"]`);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Basic meta tags
        setMetaTag('description', description);
        setMetaTag('author', author);

        // Open Graph tags
        setMetaTag('og:title', title, true);
        setMetaTag('og:description', description, true);
        setMetaTag('og:type', type, true);

        if (url) {
            setMetaTag('og:url', url, true);
        }

        if (image) {
            setMetaTag('og:image', image, true);
        }

        // Twitter Card tags
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', title);
        setMetaTag('twitter:description', description);

        if (image) {
            setMetaTag('twitter:image', image);
        }

        // Article-specific tags
        // CRITICAL FIX: Remove old article:tag elements before adding new ones
        const oldTagElements = document.querySelectorAll('meta[property="article:tag"]');
        oldTagElements.forEach(el => el.remove());

        if (type === 'article') {
            if (publishedTime) {
                setMetaTag('article:published_time', publishedTime, true);
            }

            if (tags && tags.length > 0) {
                tags.forEach((tag) => {
                    const tagElement = document.createElement('meta');
                    tagElement.setAttribute('property', 'article:tag');
                    tagElement.setAttribute('content', tag);
                    document.head.appendChild(tagElement);
                });
            }

            setMetaTag('article:author', author, true);
        }

        // Cleanup function to remove article tags on unmount
        return () => {
            const articleTags = document.querySelectorAll('meta[property="article:tag"]');
            articleTags.forEach(el => el.remove());
        };
    }, [title, description, url, image, author, publishedTime, tags, type]);

    return null;
};

export default SEO;
