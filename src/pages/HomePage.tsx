import { useState, useEffect, useRef } from 'react';
import {
    Mail, Linkedin, Github, Menu, X, Play, Pause, Volume2, ArrowRight,
    Database, Cloud, Terminal, Shield, Lock, Server, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PILLAR_PAGE, CLUSTER_ARTICLES } from '../lib/blog-graph';

const Logo = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-luminous" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="20" width="50" height="12" fill="currentColor" />
        <rect x="25" y="32" width="12" height="12" fill="currentColor" />
        <rect x="25" y="44" width="50" height="12" fill="currentColor" />
        <rect x="63" y="56" width="12" height="12" fill="currentColor" />
        <rect x="25" y="68" width="50" height="12" fill="currentColor" />
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
        <div className="mt-6 inline-flex items-center gap-4 p-2 pr-6 bg-white/[0.02] border border-white/[0.05] rounded-full hover:border-linear-blue/30 transition-colors">
            <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-linear-indigo hover:bg-linear-blue flex items-center justify-center text-white transition-transform hover:scale-105" aria-label={isPlaying ? "Pause voice introduction" : "Play voice introduction"}>
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
            <div className="flex flex-col">
                <span className="text-[10px] text-silver-gray uppercase tracking-widest font-semibold">Voice Intro</span>
                <span className="text-sm text-luminous">Hi, I'm Shahid</span>
            </div>
            <audio ref={audioRef} src="/intro.mp3" onEnded={() => setIsPlaying(false)} className="hidden" />
            {isPlaying ? (
                <div className="flex gap-1 h-4 items-center ml-2">
                    <span className="w-1 bg-linear-blue rounded-full animate-sound-wave" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 bg-linear-blue rounded-full animate-sound-wave" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-1 bg-linear-blue rounded-full animate-sound-wave" style={{ animationDelay: '400ms' }}></span>
                </div>
            ) : <Volume2 size={16} className="text-silver-gray ml-2" />}
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

        return () => {
            timeoutIds.forEach(id => clearTimeout(id));
        };
    }, []);

    return (
        <div className="hidden md:block w-full max-w-md mt-12 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 linear-inset overflow-hidden font-mono text-sm">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30"></div>
                </div>
                <span className="text-silver-gray text-[10px] uppercase tracking-widest ml-2">Terminal — s2-support</span>
            </div>
            <div className="p-4 min-h-[160px]">
                <div className="flex gap-2">
                    <span className="text-linear-blue">$</span>
                    <span className="text-luminous">{text}</span>
                    <span className="w-2 h-4 bg-linear-blue animate-blink"></span>
                </div>
                {showResult && (
                    <div className="mt-4 space-y-1 text-silver-gray animate-fade-in-down">
                        <div className="grid grid-cols-2 border-b border-white/5 pb-1 mb-1 text-[10px] uppercase tracking-wider">
                            <span>Skill</span>
                            <span>Level</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-luminous">SingleStore</span>
                            <span className="text-linear-blue">Expert</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-luminous">Distributed SQL</span>
                            <span className="text-linear-blue">Expert</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-luminous">AWS/Cloud</span>
                            <span className="text-linear-blue">Advanced</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const HomePage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const scrollToSection = (id: string, category?: string) => {
        setIsMobileMenuOpen(false);
        if (category) setSelectedCategory(category);
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-obsidian text-luminous selection:bg-linear-blue/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/[0.05] bg-obsidian/50">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
                        <div className="w-8 h-8 group-hover:scale-110 transition-transform">
                            <Logo />
                        </div>
                        <span className="text-sm font-semibold tracking-tighter uppercase">Shahidster</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-silver-gray text-xs font-medium uppercase tracking-widest">
                        {['About', 'Experience', 'Technical Arsenal', 'Certifications'].map((item) => (
                            <button key={item} onClick={() => scrollToSection(item === 'Technical Arsenal' ? 'technical-arsenal' : item.toLowerCase())} className="hover:text-luminous transition-colors">{item}</button>
                        ))}
                        <div className="w-px h-4 bg-white/10 mx-2"></div>
                        <button onClick={() => scrollToSection('contact')} className="hover:text-linear-blue transition-colors font-semibold">Connect</button>
                    </div>
                    <button className="md:hidden text-silver-gray" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section id="home" className="min-h-screen flex items-center pt-24 lg:pt-32 pb-20 relative overflow-hidden linear-mask">
                <div className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-32 items-center">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-linear-blue opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-linear-blue"></span>
                            </span>
                            <span className="text-[10px] font-bold text-silver-gray tracking-widest uppercase">Active now</span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-medium text-luminous tracking-tight leading-[1.1] letter-spacing-[-0.02em]">
                                Shahid Moosa
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-medium text-silver-gray">
                                Cloud Database <span className="text-linear-blue font-semibold">Support Engineer</span>
                            </h2>
                            <div className="flex items-center gap-2 text-xl text-silver-gray">
                                <span className="text-white/20">@</span>
                                <img src="https://logo.svgcdn.com/simple-icons/singlestore-dark.png" alt="SingleStore Logo" className="w-6 h-6 rounded-full opacity-80" />
                                <span className="font-semibold text-luminous opacity-90">SingleStore DB</span>
                            </div>
                        </div>

                        <p className="text-lg text-silver-gray max-w-xl leading-relaxed">
                            Technical resource for engineers building high-performance distributed systems. Shared production briefings, architectural deep-dives, and incident reports.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => scrollToSection('contact')} className="px-8 py-3.5 bg-linear-indigo hover:bg-linear-blue text-white font-semibold rounded-lg transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(94,106,210,0.3)]">
                                Get in Touch
                            </button>
                            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-white/[0.02] text-luminous font-medium rounded-lg border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all">
                                Download Resume
                            </a>
                        </div>

                        <div className="flex items-center gap-6 pt-6">
                            <div className="flex gap-5">
                                <a href="https://github.com/shahidmoosa" target="_blank" rel="noopener noreferrer" className="text-silver-gray hover:text-luminous transition-colors" aria-label="Github Profile"><Github size={22} /></a>
                                <a href="https://linkedin.com/in/shahidmoosa" target="_blank" rel="noopener noreferrer" className="text-silver-gray hover:text-luminous transition-colors" aria-label="LinkedIn Profile"><Linkedin size={22} /></a>
                                <a href="mailto:connect2shahidmoosa@gmail.com" className="text-silver-gray hover:text-luminous transition-colors" aria-label="Email Me"><Mail size={22} /></a>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <AudioPlayer />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 flex flex-col items-center">
                        <div className="relative group mb-8">
                            <div className="absolute -inset-1 bg-linear-indigo rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-[440px] lg:h-[440px] rounded-full overflow-hidden border-2 border-white/5 shadow-2xl">
                                <img src="/IMG_1601.jpeg" alt="Shahid Moosa" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-90" />
                            </div>
                        </div>
                        <TerminalWidget />
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="about" className="py-24 bg-white/[0.01]">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border border-white/10 linear-card shrink-0">
                        <img src="/shahid-moosa.jpg" alt="Shahid Moosa" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[1px] w-12 bg-linear-blue"></div>
                            <h2 className="text-3xl font-medium text-luminous tracking-tight">About Me</h2>
                        </div>
                        <p className="text-lg text-silver-gray leading-loose">
                            Dedicated <strong className="text-luminous font-medium">Cloud Database Support Engineer</strong> with a passion for ensuring data integrity, availability, and performance. Managing massive datasets and complex cloud environments.
                        </p>
                    </div>
                </div>
            </section>

            {/* Technical Arsenal */}
            <section id="technical-arsenal" className="py-24 bg-obsidian">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="flex items-center justify-end gap-4 mb-16">
                        <h2 className="text-3xl font-medium text-luminous tracking-tight">Technical Arsenal</h2>
                        <div className="h-[1px] w-12 bg-linear-indigo"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                        {[
                            { title: 'Databases', icon: <Database size={24} />, skills: ['PostgreSQL', 'MySQL', 'Oracle DB', 'MongoDB', 'Redis', 'Query Optimization'], color: 'indigo' },
                            { title: 'Cloud Infrastructure', icon: <Cloud size={24} />, skills: ['AWS (RDS, EC2, S3)', 'Azure SQL', 'Google Cloud SQL', 'Terraform', 'Docker/Kubernetes', 'CI/CD Pipelines'], color: 'blue' },
                            { title: 'Tools & Scripting', icon: <Terminal size={24} />, skills: ['Python / Bash', 'Linux Administration', 'Grafana / Prometheus', 'JIRA / ServiceNow', 'Git / GitHub', 'Incident Management'], color: 'silver' }
                        ].map(group => (
                            <div key={group.title} className="linear-card p-8 group">
                                <div className={`w-12 h-12 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-center mb-6 text-luminous group-hover:text-linear-blue transition-colors`}>
                                    {group.icon}
                                </div>
                                <h3 className="text-xl font-medium text-luminous mb-4 tracking-tight">{group.title}</h3>
                                <ul className="space-y-3">
                                    {group.skills.map(skill => (
                                        <li key={skill} className="flex items-center gap-2 text-silver-gray text-sm">
                                            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section id="experience" className="py-24">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-[1px] w-12 bg-linear-blue"></div>
                        <h2 className="text-3xl font-medium text-luminous tracking-tight">Experience</h2>
                    </div>

                    <div className="space-y-12 border-l border-white/5 ml-4 pl-8 relative">
                        {[
                            { role: 'Database Cloud Support Engineer', company: 'SingleStore DB', period: 'Jan 2024 - Present', desc: 'Resolving Tier-2/3 distributed systems challenges. Root-cause analysis, query optimizations, and engineering support.', techs: ['SingleStore', 'SQL', 'Linux', 'AWS', 'Python'] },
                            { role: 'Cloud Support Associate', company: 'Amazon Web Services (AWS)', period: 'July 2022 - Jan 2024', desc: 'Technical support for Amazon Aurora, RDS, and AWS DMS. Specialized in EC2, IAM, VPC, S3.', techs: ['AWS RDS', 'Aurora', 'PostgreSQL', 'DMS'] }
                        ].map((exp, idx) => (
                            <div key={idx} className="relative">
                                <span className="absolute -left-[37px] top-2 w-4 h-4 bg-obsidian border border-white/10 rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-linear-blue rounded-full"></div>
                                </span>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                    <h3 className="text-xl font-medium text-luminous tracking-tight">{exp.role}</h3>
                                    <span className="font-mono text-silver-gray text-[10px] uppercase tracking-widest">{exp.period}</span>
                                </div>
                                <span className="text-linear-blue font-medium text-sm block mb-4">{exp.company}</span>
                                <p className="text-silver-gray max-w-3xl leading-relaxed text-sm">{exp.desc}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {exp.techs.map(tech => (
                                        <span key={tech} className="px-2 py-1 bg-white/[0.02] border border-white/5 rounded text-[10px] text-silver-gray font-mono uppercase tracking-wider">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Systems Engineering */}
            <section id="blog" className="py-24 bg-white/[0.01]">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-medium text-luminous tracking-tight">Systems Engineering</h2>
                            <p className="text-silver-gray mt-2 font-mono text-[10px] uppercase tracking-[0.2em]">Technical Briefs & Production Notes</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Link to={PILLAR_PAGE.slug} className="col-span-full md:col-span-2 linear-card p-8 group">
                            <span className="text-linear-blue text-[10px] font-mono uppercase tracking-widest">Pillar Strategy</span>
                            <h3 className="text-2xl font-medium text-luminous mt-2 mb-4 group-hover:text-linear-blue transition-colors">{PILLAR_PAGE.title}</h3>
                            <p className="text-silver-gray text-sm">Architectural foundations: CAP theorem latency trade-offs, sharding strategies, and multi-node consensus.</p>
                            <div className="mt-6 flex items-center text-linear-blue text-xs font-semibold uppercase tracking-widest">Execute Deep Dive <ArrowRight size={14} className="ml-2" /></div>
                        </Link>
                        {Object.values(CLUSTER_ARTICLES as any).slice(0, 4).map((article: any) => (
                            <Link key={article.slug} to={article.slug} className="linear-card p-6 group">
                                <span className="text-[10px] text-silver-gray font-mono uppercase tracking-wider mb-2 block">{article.category}</span>
                                <h4 className="font-medium text-luminous mb-2 group-hover:text-linear-blue transition-colors">{article.title}</h4>
                                <p className="text-xs text-silver-gray line-clamp-2">Deep dive into {article.primaryKeyword}.</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-32 text-center linear-mask">
                <h2 className="text-4xl font-medium text-luminous mb-6 tracking-tight">Let's Connect</h2>
                <p className="text-silver-gray max-w-2xl mx-auto mb-10 text-lg">
                    Always open to discussing database challenges, cloud architecture, or new opportunities.
                </p>
                <a href="mailto:connect2shahidmoosa@gmail.com" className="inline-flex items-center gap-2 bg-linear-indigo px-8 py-4 rounded-lg text-white font-bold hover:bg-linear-blue transition-all shadow-[0_0_20px_rgba(94,106,210,0.2)] hover:scale-105 transform">
                    <Mail size={20} /> Send me an email
                </a>
            </section>

            <footer className="py-8 text-center text-white/20 text-[10px] uppercase tracking-[0.2em] border-t border-white/5">
                © {new Date().getFullYear()} Shahid Moosa. Engineered with Precision.
            </footer>
        </div>
    );
};

export default HomePage;
