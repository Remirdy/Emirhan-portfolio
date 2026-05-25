'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Gamepad2, Code2, Palette, Zap, Brain, Lightbulb, 
  MapPin, ExternalLink, ArrowRight 
} from 'lucide-react'

// Types
interface Skill {
  icon: React.ReactNode
  label: string
}

interface Project {
  id: number
  title: string
  description: string
  category: string
  icon: React.ReactNode
  highlights?: string[]
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
}

// More powerful animation variants for premium feel
const sectionVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] }
  }
}

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
  }
}

const phoneVariant = {
  hidden: { opacity: 0, y: 40, rotateX: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
}

export default function EmirhanDoygunPortfolio() {
  // Core Strengths
  const coreStrengths: Skill[] = [
    { icon: <Gamepad2 className="w-5 h-5" />, label: "Unity Development" },
    { icon: <Code2 className="w-5 h-5" />, label: "C# Programming" },
    { icon: <Palette className="w-5 h-5" />, label: "Game UI / HUD Design" },
    { icon: <Zap className="w-5 h-5" />, label: "Motion Graphics" },
    { icon: <Brain className="w-5 h-5" />, label: "AI Prompt Design" },
    { icon: <Lightbulb className="w-5 h-5" />, label: "Creative Problem Solving" },
  ]

  // Tools
  const tools = [
    "Unity", "C#", "Git", "GitHub", "Photoshop", 
    "After Effects", "CapCut", "React", "Tailwind", "Prompt Engineering"
  ]

  // Experience
  const experiences = [
    {
      company: "Zargas Labs",
      role: "Game & AI Creative Development",
      desc: "Contributed to game concepts, visual direction, interface ideas, and AI-assisted creative production workflows.",
      icon: <Gamepad2 className="w-5 h-5" />
    },
    {
      company: "Zargas Labs",
      role: "Digital Marketing & Prompt Design",
      desc: "Created visual concepts, ad scripts, and AI prompt systems for digital campaigns and social content.",
      icon: <Brain className="w-5 h-5" />
    },
    {
      company: "Metraj Production",
      role: "Motion Graphics",
      desc: "Worked on motion-driven visuals, After Effects production, and creative video design.",
      icon: <Palette className="w-5 h-5" />
    }
  ]

  // Selected Projects
  const projects: Project[] = [
    {
      id: 1,
      title: "ImageForge",
      description: "A creator-focused image resizing and export tool concept featuring crop controls, batch export, and preset-based workflows.",
      category: "Tool / Productivity",
      icon: <Code2 className="w-6 h-6" />,
      highlights: ["Batch Export", "Crop Controls", "Preset Workflows"]
    },
    {
      id: 2,
      title: "Unity UI & VFX Systems",
      description: "A collection of animated health bars, HUD elements, effects, and interactive UI concepts designed for more expressive game feel.",
      category: "Game Systems",
      icon: <Gamepad2 className="w-6 h-6" />,
      highlights: ["Animated HUDs", "VFX Integration", "Interactive Elements"]
    },
    {
      id: 3,
      title: "AI Motion Ads",
      description: "Cinematic ad concepts and prompt-driven visual storytelling for social media campaigns, product promotions, and short-form content.",
      category: "Creative Tech",
      icon: <Brain className="w-6 h-6" />,
      highlights: ["Cinematic Storytelling", "Prompt Engineering", "Social Campaigns"]
    },
    {
      id: 4,
      title: "Calculus Book Design",
      description: "A long-form academic content project focused on structure, visual organization, consistency, and polished presentation.",
      category: "Editorial Design",
      icon: <Palette className="w-6 h-6" />,
      highlights: ["Visual Structure", "Academic Polish", "Consistent Design"]
    }
  ]

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      {/* ==================== HERO / COVER ==================== */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 tech-bg">
        {/* Background decorative elements matching PDF futuristic style */}
        <div className="absolute inset-0 bg-[radial-gradient(#1a1a22_0.8px,transparent_1px)] bg-[length:5px_5px]" />
        
        {/* Glowing orb - inspired by PDF */}
        <div className="absolute top-1/3 right-10 w-[420px] h-[420px] rounded-full bg-[#00eaff] opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-20 left-10 w-[280px] h-[280px] rounded-full bg-[#00eaff] opacity-[0.04] blur-[90px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-[3px] mb-8"
          >
            SELECTED PORTFOLIO
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-[92px] md:text-[120px] leading-[0.82] font-bold tracking-[-6.5px] mb-4"
          >
            EMIRHAN<br />DOYGUN
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xl md:text-2xl text-white/90 tracking-tight mb-8"
          >
            <span>Game Developer</span>
            <span className="text-white/40">•</span>
            <span>AI Creative Technologist</span>
            <span className="text-white/40">•</span>
            <span>Computer Engineering Student</span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="max-w-2xl mx-auto text-lg text-white/70 mb-10 leading-relaxed"
          >
            I build playful digital experiences through Unity, C#, motion design, 
            AI-assisted visuals, and interactive interface design. My work blends 
            software, animation, and creative technology into polished, user-focused projects.
          </motion.p>

          {/* Skill Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {["Unity", "C#", "Game UI", "Motion Design", "Prompt Engineering"].map((skill, i) => (
              <div 
                key={i}
                className="skill-pill px-5 py-2 rounded-full text-sm border border-white/15 bg-white/5 hover:bg-white/10 flex items-center gap-2"
              >
                {skill}
              </div>
            ))}
          </div>

          {/* Location & Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <MapPin className="w-4 h-4" />
              <span>Istanbul, Türkiye</span>
            </div>
            <div className="hidden sm:block w-px h-3.5 bg-white/20" />
            <a 
              href="https://github.com/Remirdy" 
              target="_blank"
              className="flex items-center gap-2 text-white/60 hover:text-[#00eaff] transition-colors group"
            >
              github.com/Remirdy 
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </a>
          </div>

          <div className="mt-16">
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="group flex items-center gap-3 mx-auto text-sm uppercase tracking-[3px] text-white/50 hover:text-white transition-colors"
            >
              SCROLL TO EXPLORE
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== PROFILE & EXPERTISE ==================== */}
      <section id="about" className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="uppercase tracking-[4px] text-xs text-[#00eaff] mb-3">01 — PROFILE & EXPERTISE</div>
            <h2 className="font-display text-6xl tracking-[-2.5px] font-semibold">About Me</h2>
          </div>
          <div className="hidden md:block text-right text-sm text-white/50 max-w-[280px]">
            Computer Engineering student passionate about game development, 
            interactive design & AI-assisted creative production.
          </div>
        </div>

        {/* About paragraph */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariant}
          className="max-w-4xl mb-16 text-xl text-white/80 leading-relaxed"
        >
          I am a Computer Engineering student with a strong interest in game development, 
          interactive design, AI-assisted visual production, and motion-driven interfaces. 
          I enjoy combining software, animation, and storytelling to create engaging digital 
          experiences that feel polished, playful, and technically solid.
        </motion.div>

        {/* Four Info Cards Grid - matching PDF layout */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          
          {/* 1. Core Strengths */}
          <motion.div 
            variants={cardVariant}
            className="glass-card rounded-3xl p-7 border border-white/10"
          >
            <div className="uppercase text-xs tracking-[2px] text-[#00eaff] mb-4">01 • CORE STRENGTHS</div>
            <div className="space-y-3">
              {coreStrengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-3 text-[15px]">
                  <div className="text-[#00eaff]">{strength.icon}</div>
                  <span>{strength.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 2. Tools & Workflow */}
          <div className="glass-card rounded-3xl p-7 border border-white/10">
            <div className="uppercase text-xs tracking-[2px] text-[#00eaff] mb-4">02 • TOOLS & WORKFLOW</div>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, index) => (
                <div 
                  key={index} 
                  className="skill-pill text-sm px-4 py-1.5 rounded-2xl border border-white/10 bg-white/5"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Experience Highlights */}
          <div className="glass-card rounded-3xl p-7 border border-white/10 lg:col-span-1 md:col-span-2">
            <div className="uppercase text-xs tracking-[2px] text-[#00eaff] mb-5">03 • EXPERIENCE HIGHLIGHTS</div>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-[#00eaff]">{exp.icon}</div>
                    <div>
                      <div className="font-semibold text-[15px]">{exp.company}</div>
                      <div className="text-sm text-white/70 mb-1.5">{exp.role}</div>
                      <p className="text-sm text-white/60 leading-snug">{exp.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Education */}
          <div className="glass-card rounded-3xl p-7 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="uppercase text-xs tracking-[2px] text-[#00eaff] mb-4">04 • EDUCATION</div>
              <div className="font-semibold text-2xl leading-tight tracking-tight mb-3">
                Istanbul Ticaret University
              </div>
              <div className="text-white/70">Computer Engineering</div>
            </div>
            <div className="mt-auto pt-8 text-xs text-white/40">
              Currently pursuing degree with focus on software development, 
              interactive systems and creative technology.
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== FEATURED PROJECT: DIRTY BIRDY! ==================== */}
      <motion.section 
        id="projects" 
        className="bg-[#0a0a0f] py-20 border-y border-white/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariant}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="uppercase tracking-[4px] text-xs text-[#00eaff] mb-2">FEATURED PROJECT</div>
              <h2 className="font-display text-7xl tracking-[-3px] font-bold">Dirty Birdy!</h2>
            </div>
            <div className="hidden md:block text-right text-sm max-w-[260px] text-white/60">
              Fast-paced mobile arcade game built around timing, chaos, 
              cartoon energy and playful humor.
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Project Info */}
            <div className="lg:col-span-5">
              <div className="glass-card rounded-3xl p-8 mb-8">
                <div className="grid grid-cols-2 gap-y-6 text-sm">
                  <div>
                    <div className="text-white/50 text-xs mb-1">ROLE FOCUS</div>
                    <div>Game concept, UI ideas,<br />visual direction, creative production</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs mb-1">PLATFORM</div>
                    <div>Mobile</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs mb-1">GENRE</div>
                    <div>Arcade / Casual</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs mb-1">HIGHLIGHTS</div>
                    <div>Cartoon identity, combo system,<br />power-ups, animated interfaces</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="uppercase tracking-widest text-xs text-[#00eaff] mb-4">KEY CONTRIBUTIONS</div>
                <ul className="space-y-3 text-[15px]">
                  {[
                    "UI / HUD concepts",
                    "Game feel and visual feedback ideas",
                    "Creative direction for promotional visuals",
                    "AI-assisted design and content workflows"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00eaff] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 text-xs text-white/50">
                Screenshots sourced from official store listings.<br />
                Available on <span className="text-white/70">App Store & Google Play</span>
              </div>
            </div>

            {/* Right: Game Screenshots Mockups - inspired by PDF layout */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mockup 1 - Main Promo */}
                <div className="phone-mockup w-full max-w-[260px] mx-auto">
                  <div className="game-screen aspect-[9/16] p-4 flex flex-col">
                    <div className="text-center mt-8">
                      <div className="text-amber-400 text-4xl mb-1">🦜</div>
                      <div className="font-bold text-3xl tracking-tighter text-white">DIRTY BIRDY!</div>
                      <div className="text-amber-300 text-sm tracking-widest mt-0.5">CAUSE CHAOS • RULE THE SKY</div>
                    </div>
                    
                    <div className="mt-auto mb-4 space-y-2 px-3">
                      <div className="bg-white/90 text-black text-center py-2.5 text-sm font-semibold rounded-2xl tracking-wide">BE LEGENDARY</div>
                      <div className="bg-[#111] text-white text-center py-2.5 text-sm font-semibold rounded-2xl tracking-wide border border-white/20">BE DIRTY!</div>
                    </div>
                  </div>
                </div>

                {/* Mockup 2 - Choose Bird */}
                <div className="phone-mockup w-full max-w-[260px] mx-auto">
                  <div className="game-screen aspect-[9/16] p-4 flex flex-col text-sm">
                    <div className="text-center mt-6">
                      <div className="text-xs tracking-[2px] text-white/60">WHO WILL RULE THE SKY?</div>
                    </div>
                    <div className="mt-6 space-y-3">
                      {["Choose Your Bird", "Pick Your Chaos Style"].map((t, i) => (
                        <div key={i} className="bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-center text-sm">
                          {t}
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto text-[10px] text-center text-white/50 pb-2">Complete Missions • Unlock More Chaos</div>
                  </div>
                </div>

                {/* Mockup 3 - Missions */}
                <div className="phone-mockup w-full max-w-[260px] mx-auto">
                  <div className="game-screen aspect-[9/16] p-4 text-sm">
                    <div className="mt-5 text-center">
                      <div className="font-semibold">MISSIONS THAT KEEP<br />THE CHAOS GOING</div>
                    </div>
                    <div className="mt-6 space-y-2 text-xs">
                      <div className="bg-white/10 rounded-xl p-3">Complete Missions • Unlock More Chaos</div>
                      <div className="bg-white/10 rounded-xl p-3">New Challenges Every Flight</div>
                    </div>
                    <div className="mt-auto text-center">
                      <div className="inline-block bg-amber-400 text-black text-[10px] font-bold px-4 py-1 rounded-full">TRACK PROGRESS</div>
                    </div>
                  </div>
                </div>

                {/* Mockup 4 - Stats */}
                <div className="phone-mockup w-full max-w-[260px] mx-auto">
                  <div className="game-screen aspect-[9/16] p-4 flex flex-col">
                    <div className="text-xs text-white/60 mt-4 text-center tracking-widest">DETAILED PLAYER STATS</div>
                    
                    <div className="mt-8 space-y-4 px-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5"><span>Chaos Combo</span><span className="text-amber-400">87</span></div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[87%] bg-gradient-to-r from-amber-400 to-yellow-300" /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5"><span>Perfect Drops</span><span className="text-amber-400">142</span></div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[72%] bg-gradient-to-r from-amber-400 to-yellow-300" /></div>
                      </div>
                    </div>

                    <div className="mt-auto text-center text-[10px] text-white/50">Your progress is tracked. Keep flying dirty.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==================== SELECTED PROJECTS ==================== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[#00eaff] text-xs tracking-[3px] mb-2">SELECTED PROJECTS</div>
            <h3 className="font-display text-6xl tracking-[-2px] font-semibold">More Work</h3>
          </div>
          <a href="https://github.com/Remirdy" target="_blank" className="hidden md:flex items-center gap-2 text-sm text-white/60 hover:text-white group">
            View all on GitHub <ExternalLink className="w-4 h-4 group-hover:-translate-y-px group-hover:translate-x-px transition" />
          </a>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              whileHover={{ y: -6 }}
              variants={cardVariant}
              className="project-card group glass-card rounded-3xl p-7 border border-white/10 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-[#00eaff]">{project.icon}</div>
                <div className="text-[10px] px-3 py-1 rounded-full border border-white/10 text-white/50 tracking-widest">
                  {project.category}
                </div>
              </div>

              <h4 className="font-semibold text-2xl tracking-tight mb-3 group-hover:text-[#00eaff] transition-colors">
                {project.title}
              </h4>
              
              <p className="text-white/70 text-[15px] leading-relaxed flex-1">
                {project.description}
              </p>

              {project.highlights && (
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-1.5">
                  {project.highlights.map((h, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-white/5 rounded-full text-white/60 border border-white/10">
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ==================== WHAT I BRING + CONTACT ==================== */}
      <section id="contact" className="border-t border-white/10 bg-[#0a0a0f] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-x-8 gap-y-12">
            
            {/* What I Bring */}
            <div className="md:col-span-7">
              <div className="uppercase tracking-[3px] text-xs text-[#00eaff] mb-4">WHAT I BRING</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                {[
                  "Game-focused thinking",
                  "Clean visual communication", 
                  "Strong creative iteration",
                  "AI-assisted production",
                  "Cross-disciplinary workflow"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00eaff]" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Open to + CTA */}
            <div className="md:col-span-5">
              <div className="glass-card rounded-3xl p-9">
                <div className="text-sm text-white/60 mb-1">OPEN TO</div>
                <div className="text-2xl font-semibold tracking-tight mb-6">Internships, freelance work,<br />and creative collaborations.</div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-white/70">
                    <MapPin className="w-4 h-4 flex-shrink-0" /> Istanbul, Türkiye
                  </div>
                  <div>
                    <a href="https://github.com/Remirdy" target="_blank" className="flex items-center gap-2 text-white/70 hover:text-[#00eaff] transition-colors">
                      github.com/Remirdy <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-white/60 text-xs pt-1">Portfolio Focus: Game Development • Creative Technology • Motion Design</div>
                </div>

                <a 
                  href="https://github.com/Remirdy" 
                  target="_blank"
                  className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-white hover:bg-[#00eaff] active:bg-white text-[#050505] font-semibold py-4 rounded-2xl text-base transition-all active:scale-[0.985]"
                >
                  Let's build something creative <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-center text-[10px] text-white/40 mt-3">Or reach out via GitHub / LinkedIn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Emirhan Doygun — Built with passion for playful digital experiences.
      </footer>
    </main>
  )
}