'use client'

import { useState } from 'react'
import { Menu, X, Github } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition - bodyRect - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00eaff] to-[#00b8cc] flex items-center justify-center">
            <span className="text-[#050505] font-bold text-xl tracking-tighter">ED</span>
          </div>
          <div>
            <div className="font-semibold text-lg tracking-tight">Emirhan Doygun</div>
            <div className="text-[10px] text-white/50 -mt-1">PORTFOLIO</div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-white/70 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00eaff] transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href="https://github.com/Remirdy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-white/20 hover:bg-white/5 transition-all hover:border-white/40"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a 
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('#contact') }}
            className="px-6 py-2.5 text-sm font-semibold rounded-full bg-white text-[#050505] hover:bg-[#00eaff] hover:text-[#050505] transition-all active:scale-[0.985]"
          >
            Let's Talk
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-white/70 hover:text-white"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#050505] px-6 py-6 flex flex-col gap-4 text-sm">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-left py-2 text-white/80 hover:text-white"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a 
              href="https://github.com/Remirdy" 
              target="_blank"
              className="flex items-center gap-2 py-2 text-white/80"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a 
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection('#contact') }}
              className="w-full text-center py-3 rounded-full bg-white text-[#050505] font-semibold"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}