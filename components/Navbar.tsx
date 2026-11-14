'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import s from './portfolio/Shell.module.css'

const links = [
  { href: '/#work', label: 'Selected work' },
  { href: '/#about', label: 'About' },
  { href: '/play', label: 'Playground' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <header className={`${s.header} ${pathname === '/' ? s.home : ''}`}>
      <div className={s.navInner}>
        <a href="/" className={s.brand} aria-label="Emirhan Doygun, home" onClick={() => setOpen(false)}>ed<span>.</span></a>
        <span className={s.identity}>EMIRHAN DOYGUN<br /><span>SOFTWARE DEVELOPER</span></span>
        <nav className={s.desktopNav} aria-label="Main navigation">
          {links.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}
        </nav>
        <a href="/#contact" className={s.contactLink}>Let’s talk <ArrowUpRight size={17} /></a>
        <button className={s.menuButton} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
      </div>
      {open ? <nav id="mobile-navigation" className={s.mobileNav} aria-label="Mobile navigation">
        {links.map(link => <a href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight /></a>)}
        <a href="/#contact" onClick={() => setOpen(false)}>Let’s talk<ArrowUpRight /></a>
      </nav> : null}
    </header>
  )
}
