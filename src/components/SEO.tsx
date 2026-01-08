import { Head } from 'vite-react-ssg';

/**
 * Enhanced SEO Component for SSG
 * Uses vite-react-ssg's Head component for direct SSR injection.
 */

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    image?: string;
    author?: string;
    publishedTime?: string;
    tags?: string[];
    type?: 'website' | 'article';
    jsonLd?: any;
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
    jsonLd,
}) => {
    return (
        <Head>
            {/* Standard metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="author" content={author} />
            {url && <link rel="canonical" href={url} />}

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            {url && <meta property="og:url" content={url} />}
            {image && <meta property="og:image" content={image} />}
            <meta property="og:site_name" content="shahidster.tech" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
            <meta name="twitter:creator" content="@shahidmoosa" />

            {/* Article specific */}
            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && tags && tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}
            {type === 'article' && author && (
                <meta property="article:author" content={author} />
            )}

            {/* Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
};

export default SEO;
