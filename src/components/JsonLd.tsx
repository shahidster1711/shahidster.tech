import React from 'react';

type ArticleJsonLdProps = {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  images?: string[];
  slug: string;
};

export const ArticleJsonLd: React.FC<ArticleJsonLdProps> = ({
  headline,
  description,
  datePublished,
  dateModified,
  images = [],
  slug,
}) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://shahidster.tech${slug}`,
    },
    headline,
    description,
    image: images,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: 'Shahid Moosa',
      url: 'https://shahidster.tech',
      jobTitle: 'Cloud Database Support Engineer',
    },
    publisher: {
      '@type': 'Person',
      name: 'Shahid Moosa',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};