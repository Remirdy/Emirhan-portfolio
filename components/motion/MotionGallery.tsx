'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ChevronLeft, ChevronRight, Clapperboard, Film, UploadCloud } from 'lucide-react'
import g from './MotionGallery.module.css'

export type MotionItem = {
  file: string
  src: string
  name: string
  index: number
  poster?: string
}

function Card({ item, label, onOpen }: { item: MotionItem; label: string; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  const enter = () => { const v = ref.current; if (v) { v.currentTime = 0; v.play().catch(() => {}) } }
  const leave = () => { const v = ref.current; if (v) { v.pause() } }

  return (
    <motion.button
      className={g.card}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={onOpen}
      initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={g.badge}>{label}</span>
      <video ref={ref} src={item.src} poster={item.poster} muted loop playsInline preload="metadata" />
      <span className={g.overlay}>
        <span className={g.playDot}><Play size={18} /></span>
        <span className={g.cardName}>{item.name || item.file}</span>
      </span>
    </motion.button>
  )
}

export default function MotionGallery({ items }: { items: MotionItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const has = items.length > 0

  const close = useCallback(() => setOpen(null), [])
  const go = useCallback((dir: number) => {
    setOpen((cur) => (cur === null ? null : (cur + dir + items.length) % items.length))
  }, [items.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, close, go])

  return (
    <main className={g.page}>
      <header className={g.hero}>
        <div className={g.pill}><Clapperboard size={14} /> MOTION SHOWREEL</div>
        <h1 className={g.title}>Motion <span>Reel</span></h1>
        <p className={g.lead}>
          Animated PSD work, image-to-motion and cinematic visual production. A continuously growing reel —
          {has ? ` ${items.length} ${items.length === 1 ? 'piece' : 'pieces'} and counting.` : ' add your clips to start.'}
        </p>
      </header>

      {has ? (
        <section className={g.grid}>
          {items.map((it, i) => (
            <Card key={it.file} item={it} label={`Example ${it.index === Number.MAX_SAFE_INTEGER ? i + 1 : it.index}`} onOpen={() => setOpen(i)} />
          ))}
        </section>
      ) : (
        <section className={g.empty}>
          <UploadCloud size={40} />
          <h2>No videos yet</h2>
          <p>
            Upload your motion clips to <code>public/motion/</code> named
            <br /><b>Example_1.mp4, Example_2.mp4, Example_3.mp4 …</b><br />
            They will appear here automatically — no limit.
          </p>
        </section>
      )}

      <AnimatePresence>
        {open !== null && (
          <motion.div className={g.lightbox} onClick={close}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className={g.close} onClick={close} aria-label="Close"><X /></button>
            {items.length > 1 && <button className={`${g.nav} ${g.prev}`} onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Previous"><ChevronLeft /></button>}
            <motion.div className={g.stage} onClick={(e) => e.stopPropagation()}
              key={open} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }}>
              <video src={items[open].src} poster={items[open].poster} controls autoPlay loop playsInline />
              <div className={g.caption}><Film size={15} /> {items[open].name || items[open].file}</div>
            </motion.div>
            {items.length > 1 && <button className={`${g.nav} ${g.next}`} onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Next"><ChevronRight /></button>}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
