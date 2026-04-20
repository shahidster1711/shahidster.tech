import App from './App'
import HomePage from './pages/HomePage'
import BlogListPage from './pages/BlogListPage'
import BlogPostPage from './pages/BlogPostPage'

export const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'blog',
                element: <BlogListPage />,
            },
            {
                path: 'blog/:slug',
                element: <BlogPostPage />,
            },
            {
                path: '*',
                element: <div className="min-h-screen flex items-center justify-center text-slate-400">404 | Page Not Found</div>,
            },
        ],
    },
]
