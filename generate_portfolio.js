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
  '.github/workflows'
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
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,

  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', 
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

  '.gitignore': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
node_modules/
dist/
dist-ssr
*.local
.DS_Store`,

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

  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,

  'src/App.tsx': `import { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Cloud, 
  Terminal, 
  Mail, 
  Linkedin, 
  Github, 
  Instagram,
  ChevronDown,
  ExternalLink,
  Zap,
  Menu,
  X,
  Shield,
  Lock,
  CheckCircle2,
  GraduationCap,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

// Custom Logo Component
const Logo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z" 
      className="stroke-slate-600 fill-slate-900/50" 
      strokeWidth="4" 
    />
    <path 
      d="M65 35 H45 C35 35 35 50 45 50 H55 C65 50 65 65 55 65 H35" 
      stroke="url(#gradient)" 
      strokeWidth="8" 
      stroke-linecap="round" 
    />
    <circle cx="65" cy="35" r="4" className="fill-blue-400" />
    <circle cx="35" cy="65" r="4" className="fill-fuchsia-400" />
    <defs>
      <linearGradient id="gradient" x1="35" y1="35" x2="65" y2="65" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a855f7" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
);

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Handle play promise to catch potential autoplay errors
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Audio playback failed:", error);
            setIsPlaying(false);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="mt-6 inline-flex items-center gap-4 p-2 pr-6 bg-slate-900/50 border border-slate-800 rounded-full hover:border-fuchsia-500/30 transition-colors">
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 flex items-center justify-center text-white transition-transform hover:scale-105"
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      
      <div className="flex flex-col">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Voice Intro</span>
        <span className="text-sm text-slate-200">Hi, I'm Shahid</span>
      </div>

      {/* Audio Element - using encodeURIComponent to handle spaces safely */}
      <audio
        ref={audioRef}
        src={"/" + encodeURIComponent("AI voice - Shahid.wav")}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Simple Visualizer */}
      {isPlaying ? (
        <div className="flex gap-1 h-4 items-center ml-2">
           <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{animationDelay: '0ms'}}></span>
           <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{animationDelay: '200ms'}}></span>
           <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{animationDelay: '400ms'}}></span>
           <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{animationDelay: '100ms'}}></span>
        </div>
      ) : (
        <Volume2 size={16} className="text-slate-500 ml-2" />
      )}
    </div>
  );
};

const TerminalWidget = () => {
  const [text, setText] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  const query = "SELECT skill, level FROM expertise WHERE type = 'DB' ORDER BY level DESC;";
  
  useEffect(() => {
    let currentIndex = 0;
    let timeoutId;

    const typeChar = () => {
      if (currentIndex < query.length) {
        setText(query.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeChar, 50 + Math.random() * 50); // Random typing speed
      } else {
        // Finished typing
        timeoutId = setTimeout(() => {
          setShowResult(true);
          // Reset loop after delay
          setTimeout(() => {
            setShowResult(false);
            setText('');
            currentIndex = 0;
            typeChar();
          }, 5000);
        }, 500);
      }
    };

    typeChar();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="hidden lg:block w-full max-w-md mt-12 bg-slate-950/90 backdrop-blur-sm rounded-lg border border-fuchsia-500/30 shadow-2xl shadow-fuchsia-500/10 overflow-hidden font-mono text-xs transform hover:scale-[1.02] transition-transform duration-300">
      {/* Terminal Header */}
      <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <div className="text-slate-500 text-[10px]">singlestore-cli — 80x24</div>
      </div>
      
      {/* Terminal Body */}
      <div className="p-4 text-fuchsia-300 min-h-[180px]">
        <div className="flex flex-wrap">
          <span className="text-blue-400 mr-2">singlestore&gt;</span>
          <span>{text}</span>
          <span className="w-2 h-4 bg-fuchsia-500 ml-1 animate-blink inline-block align-middle"></span>
        </div>

        {showResult && (
          <div className="mt-2 text-fuchsia-100 animate-fade-in-down">
            <div>+-------------+----------+</div>
            <div>| skill&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| level&nbsp;&nbsp;&nbsp;&nbsp;|</div>
            <div>+-------------+----------+</div>
            <div>| SingleStore | <span className="text-green-400">Expert</span>&nbsp;&nbsp;&nbsp;|</div>
            <div>| AWS RDS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| <span className="text-green-400">Advanced</span> |</div>
            <div>| PostgreSQL&nbsp;&nbsp;| <span className="text-green-400">Advanced</span> |</div>
            <div>+-------------+----------+</div>
            <div className="text-slate-400 mt-1">3 rows in set (0.00 sec)</div>
            <div className="mt-4 text-blue-400">singlestore&gt;</div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
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
    <div className="min-h-screen bg-slate-950 text-slate-400 font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-200 overflow-x-hidden relative">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(168, 85, 247, 0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
        {/* Animated Glow Orbs */}
        <div className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      {/* Navigation */}
      <nav className={\`fixed w-full z-50 transition-all duration-300 \${isScrolled || isMobileMenuOpen ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-4' : 'bg-transparent py-6'}\`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo & Brand Area */}
          <div 
            className="flex items-center gap-3 cursor-pointer group z-50" 
            onClick={() => scrollToSection('home')}
          >
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110 duration-300">
               <div className="absolute inset-0 bg-fuchsia-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               <Logo />
            </div>
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-200 via-fuchsia-200 to-blue-200 bg-clip-text text-transparent group-hover:from-fuchsia-400 group-hover:to-blue-400 transition-all duration-300">
              shahidster.tech
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {['About', 'Experience', 'Skills', 'Certifications', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-fuchsia-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fuchsia-400 transition-all group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-300 hover:text-white z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden z-40 animate-fade-in-down">
            {['About', 'Experience', 'Skills', 'Certifications', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-2xl font-bold text-slate-300 hover:text-fuchsia-400 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center pt-24 md:pt-20 relative">
          
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            
            {/* Text Content - Left Column */}
            <div className="space-y-6 order-2 md:order-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/30 text-green-300 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Active now</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-100 tracking-tight">
                Shahid Moosa
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span>Cloud Database</span>
                <span className="text-fuchsia-400">Support Engineer</span>
                <span className="text-slate-400 inline-flex items-center gap-2">
                  <span>@</span>
                  <img 
                    src="https://github.com/singlestore.png" 
                    alt="SingleStore Logo" 
                    className="h-5 w-5 md:h-8 md:w-8 rounded-md bg-white/10 p-0.5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span>SingleStore DB</span>
                </span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed max-w-lg">
                Specializing in robust database architecture, cloud infrastructure optimization, and high-availability systems. I bridge the gap between complex data problems and seamless solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-fuchsia-500/20 text-center"
                >
                  Get in Touch
                </button>
                <a 
                  href="https://drive.google.com/file/d/16gKIjiBbLBK9Uo-Xw6cECad7oIjdHCqZ/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg font-medium transition-all hover:scale-105 border border-slate-700 flex items-center justify-center text-center"
                >
                  Download Resume
                </a>
              </div>

              {/* Social Links & Audio */}
              <div className="flex flex-col gap-6 pt-4">
                <div className="flex space-x-6 text-slate-500 justify-start">
                  <a href="https://github.com/shahidster1711/" target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition-colors"><Github size={24} /></a>
                  <a href="https://www.linkedin.com/in/shahidmoosa/" target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition-colors"><Linkedin size={24} /></a>
                  <a href="https://www.instagram.com/_shahidster_/" target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition-colors"><Instagram size={24} /></a>
                  <a href="mailto:connect2shahidmoosa@gmail.com" className="hover:text-fuchsia-400 transition-colors"><Mail size={24} /></a>
                </div>
                
                {/* Audio Player */}
                <div className="w-fit">
                  <AudioPlayer />
                </div>
              </div>

              {/* SingleStore Endorsement Section */}
              <div className="mt-8 pt-8 border-t border-slate-800/50 max-w-md">
                 <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-widest flex items-center gap-2">
                   <Zap size={12} className="text-fuchsia-400" />
                   Active Endorser & Power User
                 </p>
                 <a 
                   href="https://www.singlestore.com/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="group block bg-gradient-to-r from-slate-900/80 to-slate-900/40 p-4 rounded-xl border border-slate-800 hover:border-fuchsia-500/50 transition-all hover:shadow-lg hover:shadow-fuchsia-500/10 backdrop-blur-sm"
                 >
                   <div className="flex items-start gap-4">
                     <div className="bg-white/10 p-2 rounded-lg shrink-0 mt-1">
                       <img 
                         src="https://github.com/singlestore.png" 
                         alt="SingleStore Logo" 
                         className="h-8 w-8 object-contain"
                       />
                     </div>
                     <div>
                       <div className="flex items-center gap-2 text-slate-200 font-bold group-hover:text-fuchsia-400 transition-colors">
                         SingleStore DB <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                       </div>
                       <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                         Power your data-intensive applications with the only database that allows you to <span className="text-slate-300 font-medium">transact, analyze, and contextualize</span> data in real-time.
                       </p>
                     </div>
                   </div>
                 </a>
              </div>
            </div>

            {/* Right Column: Image and Terminal (Stacked) */}
            <div className="order-1 md:order-2 flex flex-col items-center justify-center relative mt-8 md:mt-0">
              {/* Image Container */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 group mb-8">
                {/* Decorative rings */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-blue-600 opacity-75 blur transition duration-500 group-hover:opacity-100" />
                <div className="absolute -inset-4 rounded-full border border-slate-700/50 scale-90 transition duration-700 group-hover:scale-100" />
                
                {/* Main Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-slate-950 bg-slate-900 flex items-center justify-center">
                  <img 
                    src="/IMG_1601.jpeg" 
                    alt="Shahid Moosa Headshot" 
                    className="w-full h-full object-cover transform transition duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // @ts-ignore
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback if image fails to load */}
                  <div className="hidden absolute inset-0 flex-col items-center justify-center bg-slate-800 text-slate-500 p-4 text-center">
                    <Database size={48} className="mb-2 text-fuchsia-500" />
                    <span className="text-sm">Image not found.<br/>Ensure IMG_1601.jpeg is in the same folder.</span>
                  </div>
                </div>
              </div>

              {/* Terminal Widget - Placed below image in the grid flow */}
              <TerminalWidget />
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-600 hidden md:block">
            <ChevronDown size={32} />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-slate-950/50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-8 flex items-center">
              <span className="w-12 h-1 bg-fuchsia-500 mr-4 rounded-full"></span>
              About Me
            </h2>
            <div className="prose prose-lg prose-invert text-slate-400">
              <p>
                I am a dedicated <strong>Cloud Database Support Engineer</strong> with a passion for ensuring data integrity, availability, and performance. My journey began with a curiosity for how massive datasets are stored and retrieved, evolving into a career managing complex cloud environments.
              </p>
              <p>
                I specialize in diagnosing intricate database issues, optimizing query performance, and architecting resilient cloud solutions on platforms like AWS and Azure. Whether it's a critical production outage or a long-term migration strategy, I bring a calm, analytical approach to problem-solving.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-12 flex items-center md:justify-end">
              Technical Arsenal
              <span className="w-12 h-1 bg-blue-500 ml-4 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Database Skills */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-fuchsia-500/50 transition-all group">
                <div className="w-12 h-12 bg-fuchsia-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-fuchsia-600 transition-colors">
                  <Database className="text-fuchsia-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-4">Databases</h3>
                <ul className="space-y-2">
                  {['PostgreSQL', 'MySQL', 'Oracle DB', 'MongoDB', 'Redis', 'Query Optimization'].map(skill => (
                    <li key={skill} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full mr-2"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cloud Skills */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all group">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Cloud className="text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-4">Cloud Infrastructure</h3>
                <ul className="space-y-2">
                  {['AWS (RDS, EC2, S3)', 'Azure SQL', 'Google Cloud SQL', 'Terraform', 'Docker/Kubernetes', 'CI/CD Pipelines'].map(skill => (
                    <li key={skill} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support & Tools */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-green-500/50 transition-all group">
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                  <Terminal className="text-green-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-4">Tools & Scripting</h3>
                <ul className="space-y-2">
                  {['Python / Bash', 'Linux Administration', 'Grafana / Prometheus', 'JIRA / ServiceNow', 'Git / GitHub', 'Incident Management'].map(skill => (
                    <li key={skill} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-100 mb-12 flex items-center justify-center md:justify-start">
              <span className="w-12 h-1 bg-yellow-500 mr-4 rounded-full"></span>
              Certifications
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* AWS */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-all group hover:-translate-y-1">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                   <Cloud className="text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-1">AWS Solutions Architect</h3>
                <p className="text-sm text-slate-500 mb-4">Associate Level</p>
                <div className="text-xs text-slate-400 mt-auto flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>Valid till Dec 2025</span>
                </div>
              </div>

              {/* Azure */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all group hover:-translate-y-1">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                   <Cloud className="text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-1">Azure Fundamentals</h3>
                <p className="text-sm text-slate-500 mb-4">AZ-900</p>
                <div className="text-xs text-slate-400 mt-auto flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>Verified</span>
                </div>
              </div>

              {/* Web App Pen Testing */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-red-500/50 transition-all group hover:-translate-y-1">
                 <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                   <Shield className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-1">Web App Penetration Testing</h3>
                 <p className="text-sm text-slate-500 mb-4">Security Certification</p>
                 <div className="text-xs text-slate-400 mt-auto flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>Verified</span>
                </div>
              </div>

               {/* Cyber Security */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-green-500/50 transition-all group hover:-translate-y-1">
                 <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                   <Lock className="text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-1">Cyber Security for Business</h3>
                 <p className="text-sm text-slate-500 mb-4">Introductory Level</p>
                 <div className="text-xs text-slate-400 mt-auto flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>Verified</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-16 md:py-24 bg-slate-950/50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-12 flex items-center">
              <span className="w-12 h-1 bg-fuchsia-500 mr-4 rounded-full"></span>
              Experience
            </h2>
            
            <div className="space-y-12 border-l-2 border-slate-800 ml-3 md:ml-0 pl-8 md:pl-0">
              
              {/* Job 1 */}
              <div className="relative md:ml-12 group">
                <div className="hidden md:block absolute -left-[55px] top-1 h-5 w-5 rounded-full border-4 border-slate-950 bg-fuchsia-500 group-hover:scale-125 transition-transform"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <h3 className="text-xl font-bold text-slate-200">Database Cloud Support Engineer</h3>
                  <span className="text-sm font-mono text-fuchsia-400">Jan 2024 - Present</span>
                </div>
                <h4 className="text-lg text-slate-400 mb-4 flex items-center gap-2">
                  <img 
                    src="https://github.com/singlestore.png" 
                    alt="SingleStore" 
                    className="h-5 w-5 rounded bg-white/10 p-0.5"
                  />
                  SingleStore DB
                </h4>
                <p className="mb-4">
                  Provide Tier-2/3 support for SingleStore's cloud-native and on-premise databases. Troubleshoot complex infrastructure issues using SQL, NoSQL, Linux, and AWS tools. Collaborate with product engineering to accelerate incident resolution.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['SingleStore', 'SQL', 'Linux', 'AWS', 'Python'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Job 2 */}
              <div className="relative md:ml-12 group">
                <div className="hidden md:block absolute -left-[55px] top-1 h-5 w-5 rounded-full border-4 border-slate-950 bg-slate-700 group-hover:bg-fuchsia-500 transition-colors"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <h3 className="text-xl font-bold text-slate-200">Cloud Support Associate</h3>
                  <span className="text-sm font-mono text-fuchsia-400">July 2022 - Jan 2024</span>
                </div>
                <h4 className="text-lg text-slate-400 mb-4 flex items-center gap-2">
                  <div className="p-0.5 bg-white/10 rounded">
                    <Cloud size={18} className="text-yellow-500" />
                  </div>
                  Amazon Web Services (AWS)
                </h4>
                <p className="mb-4">
                  Delivered technical support for Amazon Aurora, RDS, and AWS DMS. Specialized in AWS services (EC2, IAM, VPC, S3). Authored knowledge-base articles on IAM configuration and database optimization.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['AWS RDS', 'Aurora', 'PostgreSQL', 'DMS'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Job 3 */}
              <div className="relative md:ml-12 group">
                <div className="hidden md:block absolute -left-[55px] top-1 h-5 w-5 rounded-full border-4 border-slate-950 bg-slate-700 group-hover:bg-fuchsia-500 transition-colors"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <h3 className="text-xl font-bold text-slate-200">Senior System Associate</h3>
                  <span className="text-sm font-mono text-fuchsia-400">Apr 2020 - July 2022</span>
                </div>
                <h4 className="text-lg text-slate-400 mb-4">Infosys</h4>
                <p className="mb-4">
                  Administered SCCM and Windows systems for 100+ users, achieving 99% uptime. Managed Medical Coding operations and document control processes under EDF standards.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['SCCM', 'Windows Admin', 'Linux', 'PowerShell'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">{tag}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-12 flex items-center">
              <span className="w-12 h-1 bg-blue-500 mr-4 rounded-full"></span>
              Education
            </h2>
             <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                  <GraduationCap className="text-blue-400" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-200">BCA - Cloud Technology & Information Security</h3>
                  <p className="text-fuchsia-400 font-medium mb-2">Jain University, Bengaluru</p>
                  <p className="text-slate-500 text-sm">Graduated 2020</p>
                </div>
             </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">Let's Connect</h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
              I'm always open to discussing database challenges, cloud architecture, or new opportunities.
            </p>
            <a 
              href="mailto:connect2shahidmoosa@gmail.com" 
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all hover:-translate-y-1"
            >
              <Mail />
              <span>Send me an email</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-slate-900 text-center text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} Shahid Moosa. Built with React & Tailwind.</p>
        </footer>

      </main>
    </div>
  );
};

export default App;`
};

// Write files
Object.entries(files).forEach(([fileName, content]) => {
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content.trim());
  console.log(`Created: ${fileName}`);
});

console.log('\\n✅ All files generated successfully!');
console.log('👉 ACTION REQUIRED: Please ensure your "IMG_1601.jpeg" file is inside the "public" folder.');
console.log('👉 To start: run "npm install" and then "npm run dev"');
