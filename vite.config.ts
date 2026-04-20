import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
  },
  // SSG Options
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: 'nested',
    onFinished() { console.log('✅ SSG Generation Complete') },
    includedRoutes(paths) {
      // Dynamically discover all blog routes for pre-rendering
      const blogDir = path.resolve(__dirname, 'src/content/blog')
      const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

      const postRoutes = files.map(file => {
        const content = fs.readFileSync(path.join(blogDir, file), 'utf-8')
        const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/)
        const slug = slugMatch ? slugMatch[1] : file.replace('.md', '')
        return `/blog/${slug}`
      })

      return [...paths, '/blog', ...postRoutes]
    },
  },
} as any)