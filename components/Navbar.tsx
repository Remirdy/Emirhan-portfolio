'use client'

import { useState } from 'react'
import { Github, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'Profile' },
    { href: '/#dirty', label: 'Dirty Birdy!' },
    { href: '/play', label: 'Play' },
    { href: '/motion', label: 'Motion' },
    { href: '/umayos', label: 'UmayOS' },
    { href: '/ecoquest', label: 'EcoQuest' },
    { href: '/#imageforge', label: 'Projects' },
  ]

  const navigateTo = (href: string) => {
    const isHome = window.location.pathname === '/'

    if (href === '/' && isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setIsOpen(false)
      return
    }

    if (href.startsWith('/#') && isHome) {
      const element = document.querySelector(href.replace('/', ''))
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsOpen(false)
      return
    }

    window.location.href = href
  }

  return (
    <nav className="fixed left-1/2 top-4 z-50 w-[min(1120px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-cyan-300/15 bg-[#02070d]/70 px-4 py-3 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigateTo('/')} className="group flex items-center gap-3 text-left">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-sm font-black text-cyan-200">ED</span>
          <span>
            <span className="block text-sm font-bold tracking-tight">Emirhan Doygun</span>
            <span className="block text-[10px] font-bold tracking-[0.35em] text-cyan-200/70">PORTFOLIO</span>
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <button key={link.href} onClick={() => navigateTo(link.href)} className="text-xs font-bold uppercase tracking-[0.28em] text-white/65 transition hover:text-cyan-200">
              {link.label}
            </button>
          ))}
        </div>

        <a href="https://github.com/Remirdy" target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-xl border border-cyan-300/20 px-4 py-2 text-xs font-bold text-white/75 transition hover:border-cyan-200/60 hover:text-cyan-200 md:flex">
          <Github className="h-4 w-4" />
          GitHub
        </a>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden" aria-label="Toggle menu">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 grid gap-2 border-t border-cyan-300/10 pt-4 md:hidden">
          {links.map((link) => (
            <button key={link.href} onClick={() => navigateTo(link.href)} className="rounded-xl px-3 py-3 text-left text-sm font-bold text-white/75 hover:bg-cyan-300/10">
              {link.label}
            </button>
          ))}
          <a href="https://github.com/Remirdy" target="_blank" rel="noreferrer" className="rounded-xl px-3 py-3 text-sm font-bold text-cyan-200 hover:bg-cyan-300/10">
            GitHub
          </a>
        </div>
      )}
    </nav>
  )
}
