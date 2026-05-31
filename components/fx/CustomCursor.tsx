'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }
    let raf = 0
    let hovering = false
    let nativeCursor = false

    const move = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const t = e.target as HTMLElement
      nativeCursor = !!t.closest('video, [data-native-cursor="true"]')
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
        dot.current.style.opacity = nativeCursor ? '0' : '1'
      }
      hovering = !!t.closest('a, button, [data-cursor="hover"]')
    }

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (ring.current) {
        const scale = hovering ? 1.9 : 1
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`
        ring.current.style.opacity = nativeCursor ? '0' : hovering ? '1' : '0.6'
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] h-1.5 w-1.5 rounded-full bg-cyan-200 mix-blend-screen shadow-[0_0_12px_rgba(0,234,255,0.9)]" />
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] h-8 w-8 rounded-full border border-cyan-300/60 mix-blend-screen transition-[opacity] duration-200" style={{ boxShadow: '0 0 24px rgba(0,234,255,0.25)' }} />
    </>
  )
}
