import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://shahidster.tech';

// Read all markdown files from blog directory
const blogDir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

// Extract frontmatter date and slug from markdown files
const blogPosts = files.map(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);

  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const dateMatch = frontmatter.match(/date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
  const slugMatch = frontmatter.match(/slug:\s*["']?([^"'\n]+)["']?/);

  const slug = slugMatch ? slugMatch[1] : file.replace('.md', '');
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  return { slug, date };
}).filter((post): post is { slug: string; date: string } => Boolean(post));

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.9</priority>
  </url>
${blogPosts.map(post => `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;

// Write sitemap to public directory
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`📊 Total URLs: ${blogPosts.length + 2}`);
