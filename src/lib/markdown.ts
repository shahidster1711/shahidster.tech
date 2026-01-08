export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  image?: string;
  content: string;
  readingTime: number;
}

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with dashes
    .replace(/-+/g, '-')        // Replace multiple dashes with single dash
    .trim();
}

/**
 * Simple frontmatter parser for browser environments
 * Handles basic key: value pairs between --- separators
 */
function simpleFrontmatterParser(content: string): {
  frontmatter: Record<string, any>;
  content: string;
} {
  const trimmedContent = content.trim();
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = trimmedContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: trimmedContent };
  }

  const frontmatterBlock = match[1];
  const markdownContent = trimmedContent.replace(frontmatterRegex, '').trim();
  const frontmatter: Record<string, any> = {};

  frontmatterBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value: any = line.substring(colonIndex + 1).trim();

      // Basic type conversion
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((v: string) => v.trim().replace(/^['"]|['"]$/g, ''));
      } else if (value.toLowerCase() === 'true') {
        value = true;
      } else if (value.toLowerCase() === 'false') {
        value = false;
      } else if (!isNaN(Number(value)) && value !== '' && !value.includes('-')) {
        value = Number(value);
      } else {
        value = value.replace(/^['"]|['"]$/g, '');
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, content: markdownContent };
}

/**
 * Parse frontmatter from Markdown content
 * Uses a pure JS implementation to avoid Node.js dependency issues in the browser
 */
export function parseMarkdownWithFrontmatter(content: string): {
  frontmatter: Record<string, any>;
  content: string;
} {
  return simpleFrontmatterParser(content);
}

/**
 * Calculate reading time in minutes based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

/**
 * Extract headings from markdown content for table of contents
 */
export function extractHeadings(content: string): Array<{
  level: number;
  text: string;
  id: string;
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateSlug(text);
    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
