import fs from 'fs';
import path from 'path';

/**
 * Orphan Detection Script
 * 
 * 1. Checks if all blog posts in content/blog have a corresponding entry in blog-graph.ts (if desired)
 * 2. Checks if all entries in blog-graph.ts point to existing blog posts.
 * 3. Checks for broken internal links in markdown content.
 */

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');
const BLOG_GRAPH_PATH = path.resolve(__dirname, '../src/lib/blog-graph.ts');

async function checkOrphans() {
    console.log('🔍 Starting Orphan Detection...');

    // 1. Get all actual blog posts
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
    const slugs = files.map(file => {
        const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
        const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/)
        return slugMatch ? slugMatch[1] : file.replace('.md', '');
    });

    // 2. Read blog-graph.ts
    const graphContent = fs.readFileSync(BLOG_GRAPH_PATH, 'utf-8');

    let errors = 0;

    // Check Pillar Page
    const pillarMatch = graphContent.match(/slug:\s*['"]\/blog\/([^'"]+)['"]/);
    if (pillarMatch) {
        const pillarSlug = pillarMatch[1];
        if (!slugs.includes(pillarSlug)) {
            console.error(`❌ Pillar Page slug "${pillarSlug}" not found in blog posts!`);
            errors++;
        }
    }

    // Check Cluster Articles
    const clusterSlugs = [...graphContent.matchAll(/slug:\s*['"]\/blog\/([^'"]+)['"]/g)].map(m => m[1]);
    clusterSlugs.forEach(cs => {
        if (!slugs.includes(cs)) {
            console.error(`❌ Cluster Article slug "${cs}" not found in blog posts!`);
            errors++;
        }
    });

    // 3. Scan for broken internal links
    files.forEach(file => {
        const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
        const internalLinkRegex = /\[([^\]]+)\]\((\/blog\/[^\)]+)\)/g;
        let match;
        while ((match = internalLinkRegex.exec(content)) !== null) {
            const linkPath = match[2];
            const linkSlug = linkPath.replace('/blog/', '');
            if (!slugs.includes(linkSlug)) {
                console.error(`❌ Broken internal link in ${file}: ${linkPath}`);
                errors++;
            }
        }
    });

    if (errors === 0) {
        console.log('✅ No orphans or broken links detected.');
    } else {
        console.log(`\nFound ${errors} issues.`);
        process.exit(1);
    }
}

checkOrphans().catch(err => {
    console.error('Fatal error during orphan check:', err);
    process.exit(1);
});
