import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    author: string;
    content: string;
}

function generateRSSFeed(posts: BlogPost[], baseUrl: string): string {
    const now = new Date().toUTCString();

    const itemsXML = posts
        .map((post) => {
            const postUrl = `${baseUrl}/blog/${post.slug}`;
            const pubDate = new Date(post.date).toUTCString();

            return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author}</author>
    </item>`;
        })
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shahid Moosa - Engineering Blog</title>
    <description>Deep dives into distributed systems, database reliability, and cloud architecture</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${now}</lastBuildDate>
    <language>en-US</language>${itemsXML}
  </channel>
</rss>`;
}

async function main() {
    const baseUrl = 'https://shahidster.tech';
    const blogContentDir = path.join(__dirname, '../src/content/blog');
    const outputPath = path.join(__dirname, '../dist/rss.xml');

    console.log('📝 Generating RSS feed...');

    // Read all markdown files
    const files = fs.readdirSync(blogContentDir).filter((file) => file.endsWith('.md'));

    const posts: BlogPost[] = [];

    for (const file of files) {
        const filepath = path.join(blogContentDir, file);
        const fileContent = fs.readFileSync(filepath, 'utf-8');
        const { data: frontmatter, content: markdownContent } = matter(fileContent);

        const slug = frontmatter.slug || file.replace(/\.md$/, '');

        posts.push({
            slug,
            title: frontmatter.title || 'Untitled',
            description: frontmatter.description || '',
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            author: frontmatter.author || 'Shahid Moosa',
            content: markdownContent,
        });
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const rssXML = generateRSSFeed(posts, baseUrl);

    // Write RSS feed
    fs.writeFileSync(outputPath, rssXML, 'utf-8');

    console.log(`✅ RSS feed generated: ${outputPath}`);
    console.log(`📊 Total posts: ${posts.length}`);
}

main().catch((err) => {
    console.error('❌ Error generating RSS feed:', err);
    process.exit(1);
});
