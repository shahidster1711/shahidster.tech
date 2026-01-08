import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Mail, Linkedin, Github, Menu, X, Play, Pause, Volume2, ArrowRight,
  Database, Cloud, Terminal, Shield, Lock, Server, Code, CheckCircle, GraduationCap
} from 'lucide-react';
import mermaid from 'mermaid';
import { PILLAR_PAGE, CLUSTER_ARTICLES } from './lib/blog-graph';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';

// --- BLOG IMPORTS ---
import DistributedDatabaseSystems from './pages/blog/distributed-database-systems/index';
// (For brevity in this file generation, dynamic imports or a layout wrapper handles the rest)

// Initialize Mermaid once at app start (performance optimization)
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#e879f9', // fuchsia-400
    primaryTextColor: '#f1f5f9', // slate-100
    primaryBorderColor: '#1e293b', // slate-800
    lineColor: '#64748b', // slate-500
    secondaryColor: '#0f172a', // slate-900
    tertiaryColor: '#020617', // slate-950
    background: '#020617',
    mainBkg: '#0f172a',
    secondBkg: '#1e293b',
    textColor: '#cbd5e1', // slate-300
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
});

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
      <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 flex items-center justify-center text-white transition-transform hover:scale-105" aria-label={isPlaying ? "Pause voice introduction" : "Play voice introduction"}>
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      <div className="flex flex-col">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Voice Intro</span>
        <span className="text-sm text-slate-200">Hi, I'm Shahid</span>
      </div>
      <audio ref={audioRef} src="/intro.mp3" onEnded={() => setIsPlaying(false)} className="hidden" />
      {isPlaying ? (
        <div className="flex gap-1 h-4 items-center ml-2">
          <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{ animationDelay: '200ms' }}></span>
          <span className="w-1 bg-fuchsia-400 rounded-full animate-sound-wave" style={{ animationDelay: '400ms' }}></span>
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
    const timeoutIds: NodeJS.Timeout[] = [];

    const typeChar = () => {
      if (currentIndex < query.length) {
        setText(query.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutIds.push(setTimeout(typeChar, 50 + Math.random() * 50));
      } else {
        timeoutIds.push(setTimeout(() => {
          setShowResult(true);
          timeoutIds.push(setTimeout(() => {
            setShowResult(false);
            setText('');
            currentIndex = 0;
            typeChar();
          }, 5000));
        }, 500));
      }
    };
    typeChar();

    // Cleanup: clear all timeouts on unmount
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
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
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')} role="button" aria-label="Return to homepage" tabIndex={0}>
            <div className="w-10 h-10"><Logo /></div>
            <div className="text-xl font-bold text-slate-100">shahidster.tech</div>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {['About', 'Experience', 'Skills', 'Certifications', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase() === 'skills' ? 'technical-arsenal' : item.toLowerCase())} className="hover:text-fuchsia-400 transition-colors uppercase tracking-wide text-xs font-semibold">{item}</button>
            ))}
          </div>
          <button className="md:hidden text-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-slate-950/95 flex flex-col items-center justify-center space-y-8 md:hidden">
            {['About', 'Experience', 'Skills', 'Certifications', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase() === 'skills' ? 'technical-arsenal' : item.toLowerCase())} className="text-2xl font-bold text-slate-300 uppercase tracking-wider">{item}</button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="min-h-screen flex items-center pt-32 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">Active now</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-100 tracking-tight leading-tight">
                Shahid Moosa
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-slate-400">
                Cloud Database <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent font-bold">Support Engineer</span>
              </h2>
              <div className="flex items-center gap-2 text-xl text-slate-400">
                <span className="text-slate-500">@</span>
                <img src="https://avatars.githubusercontent.com/u/103138328?s=200&v=4" alt="SingleStore Logo" className="w-6 h-6 rounded-full grayscale hover:grayscale-0 transition-all opacity-80" />
                <span className="font-semibold text-slate-200">SingleStore DB</span>
              </div>
            </div>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Specializing in robust database architecture, cloud infrastructure optimization, and high-availability systems. I bridge the gap between complex data problems and seamless solutions.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={() => scrollToSection('contact')} className="px-8 py-3.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg shadow-fuchsia-900/20 transition-all transform hover:-translate-y-0.5">
                Get in Touch
              </button>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-slate-900/50 text-slate-200 font-medium rounded-lg border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all">
                Download Resume
              </a>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <div className="flex gap-5">
                <a href="https://github.com/shahidmoosa" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Github Profile"><Github size={22} /></a>
                <a href="https://linkedin.com/in/shahidmoosa" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn Profile"><Linkedin size={22} /></a>
                <a href="mailto:connect2shahidmoosa@gmail.com" className="text-slate-400 hover:text-white transition-colors" aria-label="Email Me"><Mail size={22} /></a>
              </div>
              <div className="w-px h-8 bg-slate-800"></div>
              <AudioPlayer />
            </div>

            {/* Endorsement Badge */}
            <div className="mt-8 pt-8 border-t border-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-fuchsia-400/80"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg></span>
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Active Endorser & Power User</span>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl inline-flex items-center gap-4 max-w-sm">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  {/* Using placeholder for SingleStore logo if specific SVG not available, or could use text */}
                  <span className="font-bold text-white text-xs">S2</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">SingleStore DB</div>
                  <div className="text-xs text-slate-400 leading-tight">Power your data-intensive apps with the only database that allows you to transact, analyze & contextualize data in real-time.</div>
                </div>
                <a href="https://singlestore.com" target="_blank" rel="noreferrer" className="ml-auto text-slate-500 hover:text-white"><ArrowRight size={14} /></a>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2 flex flex-col items-center">
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl">
                <img src="/IMG_1601.jpeg" alt="Shahid Moosa" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <TerminalWidget />
          </div>

        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-12 bg-fuchsia-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-100">About Me</h2>
          </div>
          <p className="text-lg text-slate-400 leading-loose">
            I am a dedicated <strong className="text-slate-200">Cloud Database Support Engineer</strong> with a passion for ensuring data integrity, availability, and performance. My journey began with a curiosity for how massive datasets are stored and retrieved, evolving into a career managing complex cloud environments.
          </p>
          <p className="text-lg text-slate-400 leading-loose mt-4">
            I specialize in diagnosing intricate database issues, optimizing query performance, and architecting resilient cloud solutions on platforms like AWS and Azure. Whether it's a critical production outage or a long-term migration strategy, I bring a calm, analytical approach to problem-solving.
          </p>
        </div>
      </section>

      {/* Technical Arsenal (Skills) */}
      <section id="technical-arsenal" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-end gap-4 mb-16">
            <h2 className="text-3xl font-bold text-slate-100">Technical Arsenal</h2>
            <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Databases */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-fuchsia-500/50 transition-all group">
              <div className="w-12 h-12 bg-fuchsia-900/30 rounded-lg flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 transition-transform">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Databases</h3>
              <ul className="space-y-3">
                {['PostgreSQL', 'MySQL', 'Oracle DB', 'MongoDB', 'Redis', 'Query Optimization'].map(skill => (
                  <li key={skill} className="flex items-center gap-2 text-slate-400">
                    <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cloud Infrastructure */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Cloud size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Cloud Infrastructure</h3>
              <ul className="space-y-3">
                {['AWS (RDS, EC2, S3)', 'Azure SQL', 'Google Cloud SQL', 'Terraform', 'Docker/Kubernetes', 'CI/CD Pipelines'].map(skill => (
                  <li key={skill} className="flex items-center gap-2 text-slate-400">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools & Scripting */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Tools & Scripting</h3>
              <ul className="space-y-3">
                {['Python / Bash', 'Linux Administration', 'Grafana / Prometheus', 'JIRA / ServiceNow', 'Git / GitHub', 'Incident Management'].map(skill => (
                  <li key={skill} className="flex items-center gap-2 text-slate-400">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="py-24 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-1 w-12 bg-yellow-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-100">Certifications</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* AWS Solutions Architect */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-all group">
              <div className="w-10 h-10 mb-4 text-yellow-500 border border-slate-700 rounded-lg flex items-center justify-center bg-slate-800">
                <Cloud size={20} />
              </div>
              <h3 className="font-bold text-slate-100 mb-1">AWS Solutions Architect</h3>
              <p className="text-xs text-slate-500 font-mono mb-4">Associate Level</p>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <CheckCircle size={12} /> Valid till Dec 2025
              </div>
            </div>

            {/* Azure Fundamentals */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="w-10 h-10 mb-4 text-blue-500 border border-slate-700 rounded-lg flex items-center justify-center bg-slate-800">
                <Server size={20} />
              </div>
              <h3 className="font-bold text-slate-100 mb-1">Azure Fundamentals</h3>
              <p className="text-xs text-slate-500 font-mono mb-4">AZ-900</p>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <CheckCircle size={12} /> Verified
              </div>
            </div>

            {/* Web App Pentest */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-red-500/50 transition-all group">
              <div className="w-10 h-10 mb-4 text-red-500 border border-slate-700 rounded-lg flex items-center justify-center bg-slate-800">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-slate-100 mb-1">Web App Penetration Testing</h3>
              <p className="text-xs text-slate-500 font-mono mb-4">Security Certification</p>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <CheckCircle size={12} /> Verified
              </div>
            </div>

            {/* Cyber Security */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-green-500/50 transition-all group">
              <div className="w-10 h-10 mb-4 text-green-500 border border-slate-700 rounded-lg flex items-center justify-center bg-slate-800">
                <Lock size={20} />
              </div>
              <h3 className="font-bold text-slate-100 mb-1">Cyber Security for Business</h3>
              <p className="text-xs text-slate-500 font-mono mb-4">Introductory Level</p>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <CheckCircle size={12} /> Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-1 w-12 bg-fuchsia-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-100">Experience</h2>
          </div>

          <div className="space-y-12 border-l-2 border-slate-800 ml-4 pl-8 relative">
            {/* SingleStore */}
            <div className="relative">
              <span className="absolute -left-[41px] top-2 w-5 h-5 bg-fuchsia-500 rounded-full border-4 border-slate-950"></span>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-100">Database Cloud Support Engineer</h3>
                <span className="font-mono text-fuchsia-400 text-sm">Jan 2024 - Present</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://avatars.githubusercontent.com/u/103138328?s=200&v=4" className="w-5 h-5 rounded-full grayscale opacity-70" alt="logo" />
                <span className="text-slate-300 font-medium">SingleStore DB</span>
              </div>
              <p className="text-slate-400 max-w-3xl leading-relaxed">
                Provide Tier-2/3 support for SingleStore's cloud-native and on-premise databases. Troubleshoot complex infrastructure issues using SQL, NoSQL, Linux, and AWS tools. Collaborate with product engineering to accelerate incident resolution.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['SingleStore', 'SQL', 'Linux', 'AWS', 'Python'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono hover:border-fuchsia-500/30 transition-colors">{tech}</span>
                ))}
              </div>
            </div>

            {/* AWS */}
            <div className="relative">
              <span className="absolute -left-[41px] top-2 w-5 h-5 bg-slate-700 rounded-full border-4 border-slate-950"></span>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-100">Cloud Support Associate</h3>
                <span className="font-mono text-fuchsia-400 text-sm">July 2022 - Jan 2024</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Cloud size={18} className="text-blue-500" />
                <span className="text-slate-300 font-medium">Amazon Web Services (AWS)</span>
              </div>
              <p className="text-slate-400 max-w-3xl leading-relaxed">
                Delivered technical support for Amazon Aurora, RDS, and AWS DMS. Specialized in AWS services (EC2, IAM, VPC, S3). Authored knowledge-base articles on IAM configuration and database optimization.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['AWS RDS', 'Aurora', 'PostgreSQL', 'DMS'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono hover:border-fuchsia-500/30 transition-colors">{tech}</span>
                ))}
              </div>
            </div>

            {/* Infosys */}
            <div className="relative">
              <span className="absolute -left-[41px] top-2 w-5 h-5 bg-slate-700 rounded-full border-4 border-slate-950"></span>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-100">Senior System Associate</h3>
                <span className="font-mono text-fuchsia-400 text-sm">Apr 2020 - July 2022</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-slate-300 font-medium ml-1">Infosys</span>
              </div>
              <p className="text-slate-400 max-w-3xl leading-relaxed">
                Administered SCCM and Windows systems for 100+ users, achieving 99% uptime. Managed Medical Coding operations and document control processes under EDF standards.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['SCCM', 'Windows Admin', 'Linux', 'PowerShell'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono hover:border-fuchsia-500/30 transition-colors">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-24 bg-slate-950/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-100">Education</h2>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/30 transition-all flex items-start gap-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center shrink-0 border border-slate-700">
              <GraduationCap size={32} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">BCA - Cloud Technology & Information Security</h3>
              <p className="text-fuchsia-400 font-medium mb-1">Jain University, Bengaluru</p>
              <p className="text-slate-500 text-sm">Graduated 2020</p>
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
        <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
          I'm always open to discussing database challenges, cloud architecture, or new opportunities.
        </p>
        <a href="mailto:connect2shahidmoosa@gmail.com" className="inline-flex items-center gap-2 bg-fuchsia-600 px-8 py-4 rounded-full text-white font-bold hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-900/30 hover:scale-105 transform">
          <Mail size={20} /> Send me an email
        </a>
      </section>

      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        © {new Date().getFullYear()} Shahid Moosa. Built with React & Tailwind.
      </footer>
    </div>
  );
};

// --- APP ROUTER ---

const App = () => {
  const { pathname } = useLocation();

  console.log('App rendering at path:', pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Safety check for blog metadata
  if (!PILLAR_PAGE || !CLUSTER_ARTICLES) {
    console.error('Missing blog-graph metadata!');
    return <div>Error: Missing configuration</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-slate-400">404 | Page Not Found</div>} />
    </Routes>
  );
};

export default App;