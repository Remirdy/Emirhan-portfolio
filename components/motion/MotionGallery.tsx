'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, X, ChevronLeft, ChevronRight, Clapperboard, Film, 
  Image as ImageIcon, UploadCloud, Info, Sparkles, Sliders, PlayCircle, PauseCircle
} from 'lucide-react'
import g from './MotionGallery.module.css'

export type MotionItem = {
  file: string
  src: string
  name: string
  index: number
  type: 'video' | 'image'
  poster?: string
  hasCompanion?: boolean
  companionSrc?: string
}

type Tab = 'video' | 'image'

// Rich technical specification generator based on filename/type
function getSpecsForItem(item: MotionItem) {
  const isLinked = item.hasCompanion
  const isVideo = item.type === 'video' || isLinked
  
  if (item.name.toLowerCase().includes('example')) {
    return {
      title: item.name,
      category: isLinked ? "PSD to AI Motion Studio" : (isVideo ? "Cinematic Motion Graphics" : "Static Layered PSD Design"),
      tools: isLinked 
        ? ["Photoshop", "After Effects", "Runway Gen-3", "Midjourney"]
        : (isVideo ? ["After Effects", "Premiere Pro", "Luma Dream Machine"] : ["Photoshop", "Illustrator", "Midjourney"]),
      resolution: isVideo ? "1920x1080 (Cinematic HD)" : "3840x2160 (4K Ultra HD)",
      fps: isVideo ? "30 FPS" : "Static Art",
      layers: isLinked ? "16 Separated Visual Layers" : "Flat Design",
      details: isLinked 
        ? "Original Photoshop document layered artwork brought to life using advanced AI image-to-motion parallax, volumetric lighting effects, and strict camera pan pacing."
        : "Professional storyboard and asset design with complete layer hierarchies built for digital motion and campaign workflows."
    }
  }
  
  return {
    title: item.name,
    category: isVideo ? "Creative Motion Work" : "Visual Brand Design",
    tools: ["After Effects", "Photoshop", "Illustrator"],
    resolution: isVideo ? "1920x1080" : "2048x2048",
    fps: isVideo ? "24 FPS" : "Static Art",
    layers: "Multi-layered Asset",
    details: "High fidelity creative composition focused on clean layout rhythm, volumetric shadows, and premium modern aesthetics."
  }
}

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
      <div className={g.badgeRow}>
        <span className={g.badge}>{label}</span>
        {item.hasCompanion && (
          <span className={g.linkedBadge}>
            <Sparkles size={10} /> DUAL VIEW
          </span>
        )}
      </div>
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
      <div className={g.badgeRow}>
        <span className={g.badge}>{label}</span>
        {item.hasCompanion && (
          <span className={g.linkedBadge}>
            <Sparkles size={10} /> DUAL VIEW
          </span>
        )}
      </div>
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
  
  // Lightbox & Compare States
  const [open, setOpen] = useState<number | null>(null)
  const [compareMode, setCompareMode] = useState<'static' | 'motion'>('motion')

  // Slideshow States
  const [isSlideshowRunning, setIsSlideshowRunning] = useState(false)
  const [slideshowProgress, setSlideshowProgress] = useState(0)

  const active = useMemo(() => (tab === 'video' ? videos : images), [tab, videos, images])
  const has = active.length > 0

  const close = useCallback(() => {
    setOpen(null)
    setIsSlideshowRunning(false)
  }, [])

  const go = useCallback((dir: number) => {
    setOpen((cur) => {
      if (cur === null) return null
      const nextIdx = (cur + dir + active.length) % active.length
      // Reset compare mode default on load next
      const nextItem = active[nextIdx]
      setCompareMode(nextItem?.type === 'image' ? 'static' : 'motion')
      setSlideshowProgress(0)
      return nextIdx
    })
  }, [active])

  // reset lightbox when switching tabs
  useEffect(() => { setOpen(null) }, [tab])

  // Keyboard navigation
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

  // Autoplay Slideshow Effect loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    let animationFrame: number | null = null
    let startTimestamp: number | null = null
    const duration = 8000 // 8s per slide

    if (isSlideshowRunning && open !== null) {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        setSlideshowProgress(progress)

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step)
        } else {
          go(1)
        }
      }
      animationFrame = requestAnimationFrame(step)
    } else {
      setSlideshowProgress(0)
    }

    return () => {
      if (timer) clearTimeout(timer)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [isSlideshowRunning, open, go])

  const labelFor = (it: MotionItem, i: number) =>
    `Example ${it.index >= Number.MAX_SAFE_INTEGER - 1000 ? i + 1 : it.index}`

  // Spec Sheet information derived
  const currentSpecs = useMemo(() => {
    if (open === null || !active[open]) return null
    return getSpecsForItem(active[open])
  }, [open, active])

  const handleOpenItem = (idx: number) => {
    const item = active[idx]
    setCompareMode(item.type === 'image' ? 'static' : 'motion')
    setOpen(idx)
  }

  const handleToggleSlideshow = () => {
    if (open === null && active.length > 0) {
      handleOpenItem(0)
    }
    setIsSlideshowRunning(!isSlideshowRunning)
  }

  return (
    <main className={g.page}>
      <header className={g.hero}>
        <div className={g.pill}><Clapperboard size={14} /> METRAJ PRODUCTION SHOWCASE</div>
        <h1 className={g.title}>Creative <span>Motion</span></h1>
        <p className={g.lead}>
          Animating ready-made PSD compositions, adding parallax depth, and crafting modern motion graphics.
          Explore my static layered designs alongside their animated motion counterparts in the tabs above.
        </p>

        <div className={g.headerActions}>
          <div className={g.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'video'}
              className={`${g.tab} ${tab === 'video' ? g.tabActive : ''}`}
              onClick={() => setTab('video')}
            >
              <Film size={15} /> Motion Videos <span className={g.count}>{videos.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={tab === 'image'}
              className={`${g.tab} ${tab === 'image' ? g.tabActive : ''}`}
              onClick={() => setTab('image')}
            >
              <ImageIcon size={15} /> Static Designs <span className={g.count}>{images.length}</span>
            </button>
          </div>

          {/* Slideshow button */}
          <button className={g.slideshowHeaderBtn} onClick={handleToggleSlideshow}>
            {isSlideshowRunning ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
            <span>{isSlideshowRunning ? 'PAUSE REEL' : 'PLAY CINE-REEL'}</span>
          </button>
        </div>
      </header>

      {has ? (
        <section className={g.grid}>
          {active.map((it, i) =>
            it.type === 'video' ? (
              <VideoCard key={it.file} item={it} label={labelFor(it, i)} onOpen={() => handleOpenItem(i)} />
            ) : (
              <ImageCard key={it.file} item={it} label={labelFor(it, i)} onOpen={() => handleOpenItem(i)} />
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

      {/* Cinematic Showcase Lightbox Overlay */}
      <AnimatePresence>
        {open !== null && active[open] && (
          <motion.div className={g.lightbox} onClick={close}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            {/* Upper Floating Controls */}
            <div className={g.topControlBar} onClick={e => e.stopPropagation()}>
              {/* Autoplay Slideshow Status */}
              <div className={g.slideshowStatusPill}>
                <button className={g.btnPlaySlideshow} onClick={() => setIsSlideshowRunning(!isSlideshowRunning)}>
                  {isSlideshowRunning ? <PauseCircle /> : <PlayCircle />}
                </button>
                <span>REEL AUTOPLAY</span>
                {isSlideshowRunning && (
                  <div className={g.progressTrackerLine}>
                    <div className={g.progressFillLine} style={{ width: `${slideshowProgress * 100}%` }} />
                  </div>
                )}
              </div>

              <button className={g.close} onClick={close} aria-label="Close"><X /></button>
            </div>

            {/* Left Nav Button */}
            {active.length > 1 && (
              <button className={`${g.nav} ${g.prev}`} onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Previous">
                <ChevronLeft />
              </button>
            )}

            {/* Main Stage Grid (Dual split panel: Media Left, Specs Right) */}
            <motion.div className={g.showcaseContainer} onClick={(e) => e.stopPropagation()}
              key={open} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
              
              {/* LEFT SIDE: Media Visual Player */}
              <div className={g.visualPanel}>
                
                {/* Linked Dual View Toggle */}
                {active[open].hasCompanion && (
                  <div className={g.splitViewToggleRow}>
                    <button 
                      onClick={() => setCompareMode('static')} 
                      className={`${g.toggleBtn} ${compareMode === 'static' ? g.toggleBtnActive : ''}`}
                    >
                      <ImageIcon size={14} /> STATIC DESIGN (PSD)
                    </button>
                    <button 
                      onClick={() => setCompareMode('motion')} 
                      className={`${g.toggleBtn} ${compareMode === 'motion' ? g.toggleBtnActive : ''}`}
                    >
                      <Film size={14} /> MOTION REEL (AI)
                    </button>
                  </div>
                )}

                {/* Media Render Box */}
                <div className={g.mediaStage}>
                  <AnimatePresence mode="wait">
                    {compareMode === 'motion' ? (
                      <motion.video 
                        key="video-media"
                        src={active[open].type === 'video' ? active[open].src : active[open].companionSrc} 
                        poster={active[open].poster} 
                        controls 
                        autoPlay 
                        loop 
                        playsInline
                        className={g.stageMediaContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    ) : (
                      <motion.img 
                        key="image-media"
                        src={active[open].type === 'image' ? active[open].src : active[open].companionSrc} 
                        alt={active[open].name || active[open].file}
                        className={g.stageMediaContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT SIDE: Sophisticated Technical Specs Side Sheet */}
              <div className={g.specSidebar}>
                <div className={g.sidebarHeader}>
                  <div className={g.specsPill}><Info size={12} /> TECHNICAL SHEETS</div>
                  <h2>{currentSpecs?.title}</h2>
                  <span className={g.specCategory}>{currentSpecs?.category}</span>
                </div>

                <div className={g.specsBlockContainer}>
                  <div className={g.specParamRow}>
                    <span>RESOLUTION</span>
                    <b>{currentSpecs?.resolution}</b>
                  </div>
                  <div className={g.specParamRow}>
                    <span>FRAMERATE</span>
                    <b>{currentSpecs?.fps}</b>
                  </div>
                  <div className={g.specParamRow}>
                    <span>PSD LAYERS</span>
                    <b>{currentSpecs?.layers}</b>
                  </div>
                </div>

                {/* Tools Used section */}
                <div className={g.toolsContainer}>
                  <h4>WORKFLOW STACK</h4>
                  <div className={g.toolsTagsList}>
                    {currentSpecs?.tools.map(tool => (
                      <span key={tool} className={g.toolTag}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Brief description detail */}
                <div className={g.detailDescription}>
                  <h4>PRODUCTION NOTES</h4>
                  <p>{currentSpecs?.details}</p>
                </div>

                {/* Footer brand info */}
                <div className={g.sidebarFooter}>
                  <span>Metraj Production • Design enhancement template</span>
                </div>
              </div>

            </motion.div>

            {/* Right Nav Button */}
            {active.length > 1 && (
              <button className={`${g.nav} ${g.next}`} onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Next">
                <ChevronRight />
              </button>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
