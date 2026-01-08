# SEO & Technical Validation Checklist (Vite Edition)

## 1. SPA SEO Strategy
- [ ] Since this is a Vite SPA, ensure `index.html` has default meta tags.
- [ ] For better social sharing, consider using `react-helmet-async` to dynamically update `<title>` and `<meta>` tags inside the React components.
- [ ] Verify `robots.txt` allows crawling.

## 2. Structure & Links
- [ ] **Blog Graph:** Ensure `src/lib/blog-graph.ts` matches the Routes defined in `App.tsx`.
- [ ] **Navigation:** Test that clicking a blog link uses Client-Side Routing (no page refresh).
- [ ] **404 Handling:** Verify the wildcard route `*` catches unknown paths.

## 3. Performance
- [ ] **Lazy Loading:** Implement `React.lazy()` for blog posts to keep the main bundle size small.
  ```typescript
  const BlogPost = React.lazy(() => import('./pages/blog/post'));
  ```
- [ ] **Images:** Ensure images in `public/` are optimized webp/jpg.

## 4. Deployment
- [ ] **GitHub Pages:** Ensure the deploy workflow handles the SPA routing (redirecting 404s to index.html) if using a custom domain, or use HashRouter (implemented).