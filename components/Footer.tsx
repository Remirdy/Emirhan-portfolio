'use client'

import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import s from './portfolio/Shell.module.css'

export default function Footer() {
  const pathname = usePathname()
  return <footer className={`${s.footer} ${pathname === '/' ? s.home : ''}`}>
    <div><a href="/" className={s.footerName}>Emirhan Doygun.</a><span>© {new Date().getFullYear()}</span></div>
    <div className={s.footerLinks}><a href="https://github.com/Remirdy" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/remirdy/" target="_blank" rel="noreferrer">LinkedIn ↗</a><button onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Back to top <ArrowUp size={15} /></button></div>
  </footer>
}
