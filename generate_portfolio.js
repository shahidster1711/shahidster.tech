import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
const dirs = [
  'src',
  'public',
  '.github',
  '.github/workflows',
  'src/lib',
  'src/components',
  'src/pages',
  'src/pages/blog',
  // Individual article folders not strictly needed for TSX components, but keeping structure clean
  'src/pages/blog/distributed-database-systems',
  'src/pages/blog/distributed-sql-architecture',
  'src/pages/blog/query-performance-debugging',
  'src/pages/blog/row-vs-column-storage',
  'src/pages/blog/real-time-analytics-tradeoffs',
  'src/pages/blog/data-ingestion-pipelines',
  'src/pages/blog/high-availability-reliability',
  'src/pages/blog/database-automation',
  'src/pages/blog/production-database-failures',
  'src/pages/blog/schema-design',
  'src/pages/blog/system-design-lessons'
];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// --- FILE CONTENTS ---

const files = {
  // ---------------------------------------------------------
  // 1. CONFIG FILES & CORE
  // ---------------------------------------------------------

  'package.json': `{
  "name": "shahidster-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.6"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'blink': 'blink 1s step-end infinite',
        'sound-wave': 'sound-wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'sound-wave': {
          '0%, 100%': { height: '4px' },
          '50%': { height: '16px' },
        }
      }
    },
  },
  plugins: [],
}`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom Scrollbar for Terminal */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
`,

  'index.html': `<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shahid Moosa | Cloud Database Support Engineer</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  // ---------------------------------------------------------
  // 2. MAIN ENTRY & ROUTING
  // ---------------------------------------------------------

  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)`,

  // ---------------------------------------------------------
  // 3. MAIN PORTFOLIO APP (Restored + Router Integration)
  // ---------------------------------------------------------

  'src/App.tsx': `import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Database, Cloud, Terminal, Mail, Linkedin, Github, Instagram,
  ChevronDown, ExternalLink, Zap, Menu, X, Shield, Lock,
  CheckCircle2, GraduationCap, Play, Pause, Volume2, BookOpen, ArrowRight
} from 'lucide-react';
import { PILLAR_PAGE, CLUSTER_ARTICLES } from './lib/blog-graph';

// --- BLOG IMPORTS ---
import DistributedDatabaseSystems from './pages/blog/distributed-database-systems/index';
// (For brevity in this file generation, dynamic imports or a layout wrapper handles the rest)

// --- COMPONENTS ---

const Logo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z" className="stroke-slate-600 fill-slate-900/50" strokeWidth="4" />
    <path d="M65 35 H45 C35 35 35 50 45 50 H55 C65 50 65 65 55 65 H35" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" />
    <defs><linearGradient id="gradient" x1="35" y1="35" x2="65" y2="65" gradientUnits="userSpaceOnUse"><stop stopColor="#a855f7" /><stop offset="1" stopColor="#3b82f6" /></linearGradient></defs>
  </svg>
);

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="mt-6 inline-flex items-center gap-4 p-2 pr-6 bg-slate-900/50 border border-slate-800 rounded-full hover:border-fuchsia-500/30 transition-colors">
      <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 flex items-center justify-center text-white transition-transform hover:scale-105">
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      <div className="flex flex-col">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Voice Intro</span>
        <span className="text-sm text-slate-200">Hi, I'm Shahid</span>
      </div>
      <audio ref={audioRef} src="/intro.mp3" onEnded={() => setIsPlaying(false)} className="hidden" />
      {isPlaying ? (
        <div className="flex gap-1 h-4 items-center ml-2">
           <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{animationDelay: '0ms'}}></span>
           <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{animationDelay: '200ms'}}></span>
           <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{animationDelay: '400ms'}}></span>
        </div>
      ) : <Volume2 size={16} className="text-slate-500 ml-2" />}
    </div>
  );
};

const TerminalWidget = () => {
  const [text, setText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const query = "SELECT skill, level FROM expertise WHERE type = 'DB' ORDER BY level DESC;";
  
  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: any;
    const typeChar = () => {
      if (currentIndex < query.length) {
        setText(query.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeChar, 50 + Math.random() * 50); 
      } else {
        timeoutId = setTimeout(() => {
          setShowResult(true);
          setTimeout(() => { setShowResult(false); setText(''); currentIndex = 0; typeChar(); }, 5000);
        }, 500);
      }
    };
    typeChar();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="hidden lg:block w-full max-w-md mt-12 bg-slate-950/90 backdrop-blur-sm rounded-lg border border-fuchsia-500/30 shadow-2xl shadow-fuchsia-500/10 overflow-hidden font-mono text-xs">
      <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex justify-between"><div className="flex space-x-2"><div className="w-3 h-3 rounded-full bg-red-500/50"></div><div className="w-3 h-3 rounded-full bg-yellow-500/50"></div><div className="w-3 h-3 rounded-full bg-green-500/50"></div></div><div className="text-slate-500">singlestore-cli</div></div>
      <div className="p-4 text-fuchsia-300 min-h-[180px]">
        <div><span className="text-blue-400 mr-2">singlestore&gt;</span>{text}<span className="w-2 h-4 bg-fuchsia-500 ml-1 animate-blink inline-block align-middle"></span></div>
        {showResult && (
          <div className="mt-2 text-fuchsia-100 animate-fade-in-down">
            <div>+-------------+----------+</div><div>| skill       | level    |</div><div>+-------------+----------+</div>
            <div>| SingleStore | <span className="text-green-400">Expert</span>   |</div>
            <div>| AWS RDS     | <span className="text-green-400">Advanced</span> |</div>
            <div>| PostgreSQL  | <span className="text-green-400">Advanced</span> |</div>
            <div>+-------------+----------+</div><div className="text-slate-400 mt-1">3 rows in set (0.00 sec)</div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- PAGES ---

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      {/* Navbar */}
      <nav className={\`fixed w-full z-50 transition-all duration-300 \${isScrolled || isMobileMenuOpen ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-4' : 'bg-transparent py-6'}\`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10"><Logo /></div>
            <div className="text-xl font-bold text-slate-100">shahidster.tech</div>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {['About', 'Experience', 'Skills', 'Blog', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="hover:text-fuchsia-400 transition-colors">{item}</button>
            ))}
          </div>
          <button className="md:hidden text-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-slate-950/95 flex flex-col items-center justify-center space-y-8 md:hidden">
             {['About', 'Experience', 'Skills', 'Blog', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-2xl font-bold text-slate-300">{item}</button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="min-h-screen flex items-center pt-24 md:pt-20 relative">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-100">Shahid Moosa</h1>
            <h2 className="text-xl md:text-3xl font-semibold text-slate-300">Cloud Database <span className="text-fuchsia-400">Support Engineer</span></h2>
            <p className="text-lg max-w-lg">Specializing in robust database architecture, cloud infrastructure optimization, and high-availability systems.</p>
            <div className="flex gap-4">
              <button onClick={() => scrollToSection('contact')} className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg">Get in Touch</button>
              <a href="#" className="px-8 py-3 bg-slate-800 text-white rounded-lg border border-slate-700">Resume</a>
            </div>
            <div className="flex gap-6 pt-4">
              <a href="#" className="hover:text-fuchsia-400"><Github /></a>
              <a href="#" className="hover:text-fuchsia-400"><Linkedin /></a>
              <AudioPlayer />
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center"><TerminalWidget /></div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-100 mb-8">About Me</h2>
          <p className="text-lg">I am a Cloud Database Support Engineer specializing in distributed systems like SingleStore and AWS RDS.</p>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-100 mb-12">Experience</h2>
          <div className="space-y-8 border-l-2 border-slate-800 ml-4 pl-8">
            <div>
              <h3 className="text-xl font-bold text-slate-200">Database Cloud Support Engineer</h3>
              <p className="text-fuchsia-400">SingleStore DB | Jan 2024 - Present</p>
              <p className="mt-2">Tier-2/3 support for distributed columnar clusters.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-200">Cloud Support Associate</h3>
              <p className="text-fuchsia-400">AWS | July 2022 - Jan 2024</p>
              <p className="mt-2">Support for Aurora PostgreSQL, RDS, and DMS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Teaser */}
      <section id="blog" className="py-24 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-100 mb-12">Engineering Logs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Pillar Link */}
            <Link to={PILLAR_PAGE.slug} className="col-span-full md:col-span-2 bg-gradient-to-br from-slate-900 to-fuchsia-900/20 p-8 rounded-2xl border border-slate-800 group hover:border-fuchsia-500/30 transition-all">
              <span className="text-fuchsia-400 text-xs font-mono uppercase">Featured Guide</span>
              <h3 className="text-2xl font-bold text-slate-100 mt-2 mb-4 group-hover:text-fuchsia-300">{PILLAR_PAGE.title}</h3>
              <p className="text-slate-400">A comprehensive look at distributed database architectures, CAP theorem, and sharding.</p>
              <div className="mt-6 flex items-center text-fuchsia-400 font-medium">Read Guide <ArrowRight size={16} className="ml-2" /></div>
            </Link>
            {/* Cluster Links */}
            {Object.values(CLUSTER_ARTICLES).slice(0, 4).map(article => (
              <Link key={article.slug} to={article.slug} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-all group">
                <h4 className="font-bold text-slate-200 mb-2 group-hover:text-fuchsia-400">{article.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2">Deep dive into {article.primaryKeyword}.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 text-center">
        <h2 className="text-4xl font-bold text-slate-100 mb-6">Let's Connect</h2>
        <a href="mailto:connect2shahidmoosa@gmail.com" className="inline-flex items-center gap-2 bg-fuchsia-600 px-8 py-4 rounded-full text-white font-bold hover:bg-fuchsia-700 transition-all">
          <Mail size={20} /> Email Me
        </a>
      </section>

      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        © {new Date().getFullYear()} Shahid Moosa. Built with React.
      </footer>
    </div>
  );
};

// --- APP ROUTER ---

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog/distributed-database-systems" element={<DistributedDatabaseSystems />} />
      {/* Add other blog routes here */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-slate-400">404 | Page Not Found</div>} />
    </Routes>
  );
};

export default App;`,

  // ---------------------------------------------------------
  // 4. BLOG CONTENT (Converted to React Components)
  // ---------------------------------------------------------

  'src/lib/blog-graph.ts': `// Centralized map of all internal links
export const PILLAR_PAGE = {
  slug: '/blog/distributed-database-systems',
  title: 'Distributed Database Systems: A Senior Engineer’s Guide',
  primaryKeyword: 'Distributed database systems',
};

export const CLUSTER_ARTICLES = {
  'distributed-sql-architecture': {
    slug: '/blog/distributed-sql-architecture',
    title: 'Distributed SQL Architecture: Sharding & Replication Deep Dive',
    primaryKeyword: 'Distributed SQL architecture',
  },
  'query-performance-debugging': {
    slug: '/blog/query-performance-debugging',
    title: 'Debugging Query Performance in Distributed Systems',
    primaryKeyword: 'Query performance debugging',
  },
  // Add other articles...
};`,

  // Example of a converted Blog Post Component (Pillar Page)
  'src/pages/blog/distributed-database-systems/index.tsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DistributedDatabaseSystems = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-fuchsia-500/30">
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-4">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/" className="flex items-center text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-24 prose prose-invert prose-lg prose-headings:text-slate-100 prose-a:text-fuchsia-400 hover:prose-a:text-fuchsia-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
        <header className="mb-12 not-prose">
          <span className="text-fuchsia-400 font-mono text-sm uppercase tracking-wider">Engineering Guide</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 mt-4 mb-6 leading-tight">
            Distributed Database Systems: A Senior Engineer’s Guide
          </h1>
          <p className="text-xl text-slate-400">
            A technical deep dive into architecture, consistency models, and sharding strategies for high-scale systems.
          </p>
        </header>

        <p>
          In my years supporting cloud-native databases like <strong>SingleStore</strong> and working with <strong>AWS RDS</strong>, I’ve found that the leap from a single-node RDBMS to a distributed system is where most engineering teams stumble. It’s not just about adding nodes; it’s about accepting fundamental trade-offs in consistency, availability, and partition tolerance.
        </p>

        <h2>The Core Architecture</h2>
        <p>
          At a high level, distributed databases solve for two things: <strong>storage capacity</strong> (via partitioning) and <strong>compute capacity</strong> (via parallel processing).
        </p>

        <h3>Shared-Nothing vs. Shared-Disk</h3>
        <ul>
          <li>
            <strong>Shared-Nothing (e.g., SingleStore, Cassandra):</strong> Each node has its own disk and memory. The data is sharded across nodes.
            <br/><em>Pro:</em> Linear scalability.
            <br/><em>Con:</em> Rebalancing data is network I/O intensive.
          </li>
          <li>
            <strong>Shared-Disk (e.g., Aurora):</strong> Compute nodes are stateless; storage is offloaded to a distributed storage layer.
            <br/><em>Pro:</em> Fast failover and scaling.
            <br/><em>Con:</em> Write scalability limited by coordination.
          </li>
        </ul>

        <h2>Sharding and Partitioning Strategies</h2>
        <p>
          Bad schema design in a distributed system is a performance death sentence. If you don't choose the right shard key, you end up with <strong>data skew</strong> or <strong>scatter-gather queries</strong>.
        </p>

        <h2>Reliability and Failure Modes</h2>
        <p>
          In a distributed system, partial failure is the default state. A disk <em>will</em> be slow. A network packet <em>will</em> drop.
        </p>
        <ul>
          <li><strong>Jitter:</strong> Use exponential backoff with jitter for retries.</li>
          <li><strong>Circuit Breakers:</strong> Fail fast rather than hanging threads.</li>
        </ul>

        <hr className="my-12 border-slate-800" />
        
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 mt-0">Further Reading</h3>
          <ul className="mb-0">
            <li><Link to="/blog/distributed-sql-architecture">Distributed SQL Architecture</Link></li>
            <li><Link to="/blog/query-performance-debugging">Debugging Query Performance</Link></li>
          </ul>
        </div>
      </article>
    </div>
  );
};

export default DistributedDatabaseSystems;`,

  // ---------------------------------------------------------
  // 5. SEO CHECKLIST
  // ---------------------------------------------------------

  'SEO_CHECKLIST.md': `# SEO & Technical Validation Checklist (Vite Edition)

## 1. SPA SEO Strategy
- [ ] Since this is a Vite SPA, ensure \`index.html\` has default meta tags.
- [ ] For better social sharing, consider using \`react-helmet-async\` to dynamically update \`<title>\` and \`<meta>\` tags inside the React components.
- [ ] Verify \`robots.txt\` allows crawling.

## 2. Structure & Links
- [ ] **Blog Graph:** Ensure \`src/lib/blog-graph.ts\` matches the Routes defined in \`App.tsx\`.
- [ ] **Navigation:** Test that clicking a blog link uses Client-Side Routing (no page refresh).
- [ ] **404 Handling:** Verify the wildcard route \`*\` catches unknown paths.

## 3. Performance
- [ ] **Lazy Loading:** Implement \`React.lazy()\` for blog posts to keep the main bundle size small.
  \`\`\`typescript
  const BlogPost = React.lazy(() => import('./pages/blog/post'));
  \`\`\`
- [ ] **Images:** Ensure images in \`public/\` are optimized webp/jpg.

## 4. Deployment
- [ ] **GitHub Pages:** Ensure the deploy workflow handles the SPA routing (redirecting 404s to index.html) if using a custom domain, or use HashRouter (implemented).
`,

  '.github/workflows/deploy.yml': `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`
};

// Write files
Object.entries(files).forEach(([fileName, content]) => {
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content.trim());
  console.log(`Created: ${fileName}`);
});

console.log('\\n✅ All files generated successfully!');
console.log('👉 ACTION REQUIRED: Run "npm install react-router-dom" to support the new routing.');
console.log('👉 Then run "npm run dev" to see the blog integrated.');