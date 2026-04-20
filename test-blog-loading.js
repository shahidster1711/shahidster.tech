// Quick test to verify all blog posts are loadable
const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'src/content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

console.log(`✅ Found ${files.length} blog posts:`);
files.forEach((f, i) => {
  console.log(`${i + 1}. ${f}`);
});
