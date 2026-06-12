'use client'

import { Github, Mail, ArrowUp } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-12 border-t border-white/10 bg-[#050505]/95">
      <div className="max-w-[1240px] mx-auto px-5 py-10 text-sm">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-start">
          {/* Brand + tagline */}
          <div className="md:w-5/12">
            <div className="flex items-center gap-3 mb-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl border border-amber-200/30 bg-amber-200/10 text-sm font-black text-amber-100">ED</span>
              <div>
                <div className="font-bold tracking-tight">Emirhan Doygun</div>
                <div className="text-[10px] tracking-[3px] text-amber-100/60 font-bold">REMIRDY • CREATIVE RUNTIME</div>
              </div>
            </div>
            <p className="text-white/60 max-w-sm leading-relaxed">
              Game developer, motion designer &amp; AI tooling builder. I turn chaos into playable experiences and static art into living motion.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/Remirdy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-1.5 text-xs font-bold hover:border-amber-200/40 hover:text-amber-100 transition"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
              <button
                onClick={() => window.location.href = 'mailto:hello@emirhan.dev?subject=Portfolio%20inquiry'}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-1.5 text-xs font-bold hover:border-amber-200/40 hover:text-amber-100 transition"
              >
                <Mail className="h-3.5 w-3.5" /> Email me
              </button>
            </div>
            <div className="mt-3 text-[10px] text-white/40">
              Open to freelance / full-time roles in games, motion, creative tech &amp; AI-assisted pipelines.
            </div>
          </div>

          {/* Quick nav */}
          <div className="md:w-3/12">
            <div className="uppercase tracking-[2px] text-[10px] font-black text-white/50 mb-3">Explore</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-white/75 text-sm">
              <a href="/#dirty" className="hover:text-white transition">Dirty Birdy! Lab</a>
              <a href="/#imageforge" className="hover:text-white transition">ImageForge</a>
              <a href="/#aftereffects-mcp" className="hover:text-white transition">After Effects MCP</a>
              <a href="/#blendermcp" className="hover:text-white transition">BlenderMCP</a>
              <a href="/play" className="hover:text-white transition">Play — Donut Tycoon</a>
              <a href="/motion" className="hover:text-white transition">Motion Reel</a>
              <a href="/umayos" className="hover:text-white transition">UmayOS</a>
              <a href="/ecoquest" className="hover:text-white transition">EcoQuest</a>
              <a href="/#concepts" className="hover:text-white transition">Children&apos;s Book Concepts</a>
              <a href="/#cv" className="hover:text-white transition">Experience &amp; CV</a>
            </div>
          </div>

          {/* Contact / status */}
          <div className="md:w-4/12">
            <div className="uppercase tracking-[2px] text-[10px] font-black text-white/50 mb-3">Current status</div>
            <div className="text-white/80 text-sm leading-snug mb-4">
              Based in Istanbul • Computer Engineering student • Building tools that make creative work faster and more fun.
            </div>

            <button
              onClick={scrollToTop}
              className="group mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-200/70 hover:text-amber-100 transition"
            >
              Back to top <ArrowUp className="h-3 w-3 group-hover:-translate-y-0.5 transition" />
            </button>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-2 md:items-center justify-between text-[10px] text-white/40">
          <div>© {year} Emirhan Doygun — All rights (and bugs) reserved. Made with Next.js, Three.js, and a healthy amount of chaos.</div>
          <div className="flex gap-4">
            <span>Interactive portfolio v2</span>
            <a href="https://github.com/Remirdy" target="_blank" rel="noreferrer" className="hover:text-white/70">Source on GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
