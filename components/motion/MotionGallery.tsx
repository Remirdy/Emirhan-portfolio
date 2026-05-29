'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ChevronLeft, ChevronRight, Clapperboard, Film, Image as ImageIcon, UploadCloud } from 'lucide-react'
import g from './MotionGallery.module.css'

export type MotionItem = {
  file: string
  src: string
  name: string
  index: number
  type: 'video' | 'image'
  poster?: string
}

type Tab = 'video' | 'image'

function VideoCard({ item, label, onOpen }: { item: MotionItem; label: string; onOpen: () => void }) {
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

function ImageCard({ item, label, onOpen }: { item: MotionItem; label: string; onOpen: () => void }) {
  return (
    <motion.button
      className={g.card}
      onClick={onOpen}
      initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={g.badge}>{label}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.name || item.file} loading="lazy" />
      <span className={g.overlay}>
        <span className={g.playDot}><ImageIcon size={18} /></span>
        <span className={g.cardName}>{item.name || item.file}</span>
      </span>
    </motion.button>
  )
}

export default function MotionGallery({ videos, images }: { videos: MotionItem[]; images: MotionItem[] }) {
  const total = videos.length + images.length
  const initialTab: Tab = videos.length === 0 && images.length > 0 ? 'image' : 'video'
  const [tab, setTab] = useState<Tab>(initialTab)
  const [open, setOpen] = useState<number | null>(null)

  const active = useMemo(() => (tab === 'video' ? videos : images), [tab, videos, images])
  const has = active.length > 0

  const close = useCallback(() => setOpen(null), [])
  const go = useCallback((dir: number) => {
    setOpen((cur) => (cur === null ? null : (cur + dir + active.length) % active.length))
  }, [active.length])

  // reset lightbox when switching tabs
  useEffect(() => { setOpen(null) }, [tab])

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

  const labelFor = (it: MotionItem, i: number) =>
    `Example ${it.index >= Number.MAX_SAFE_INTEGER - 1000 ? i + 1 : it.index}`

  return (
    <main className={g.page}>
      <header className={g.hero}>
        <div className={g.pill}><Clapperboard size={14} /> MOTION SHOWREEL</div>
        <h1 className={g.title}>Motion <span>Reel</span></h1>
        <p className={g.lead}>
          Animated PSD work, image-to-motion and cinematic visual production. A continuously growing reel
          {total > 0 ? ` — ${total} ${total === 1 ? 'piece' : 'pieces'} and counting.` : '.'}
        </p>

        <div className={g.tabs} role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'video'}
            className={`${g.tab} ${tab === 'video' ? g.tabActive : ''}`}
            onClick={() => setTab('video')}
          >
            <Film size={15} /> Videos <span className={g.count}>{videos.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={tab === 'image'}
            className={`${g.tab} ${tab === 'image' ? g.tabActive : ''}`}
            onClick={() => setTab('image')}
          >
            <ImageIcon size={15} /> Images <span className={g.count}>{images.length}</span>
          </button>
        </div>
      </header>

      {has ? (
        <section className={g.grid}>
          {active.map((it, i) =>
            it.type === 'video' ? (
              <VideoCard key={it.file} item={it} label={labelFor(it, i)} onOpen={() => setOpen(i)} />
            ) : (
              <ImageCard key={it.file} item={it} label={labelFor(it, i)} onOpen={() => setOpen(i)} />
            )
          )}
        </section>
      ) : (
        <section className={g.empty}>
          <UploadCloud size={40} />
          <h2>{tab === 'video' ? 'No videos yet' : 'No images yet'}</h2>
          <p>
            Upload your {tab === 'video' ? 'motion clips' : 'images'} to <code>public/motion/</code> named
            <br />
            <b>
              {tab === 'video'
                ? 'Example_1.mp4, Example_2.mp4, Example_3.mp4 …'
                : 'Example_1.jpg, Example_2.png, Example_3.webp …'}
            </b>
            <br />
            They appear here automatically — no limit.
          </p>
        </section>
      )}

      <AnimatePresence>
        {open !== null && (
          <motion.div className={g.lightbox} onClick={close}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className={g.close} onClick={close} aria-label="Close"><X /></button>
            {active.length > 1 && <button className={`${g.nav} ${g.prev}`} onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Previous"><ChevronLeft /></button>}
            <motion.div className={g.stage} onClick={(e) => e.stopPropagation()}
              key={open} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }}>
              {active[open].type === 'video' ? (
                <video src={active[open].src} poster={active[open].poster} controls autoPlay loop playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={g.stageImg} src={active[open].src} alt={active[open].name || active[open].file} />
              )}
              <div className={g.caption}>
                {active[open].type === 'video' ? <Film size={15} /> : <ImageIcon size={15} />}
                {active[open].name || active[open].file}
              </div>
            </motion.div>
            {active.length > 1 && <button className={`${g.nav} ${g.next}`} onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Next"><ChevronRight /></button>}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
